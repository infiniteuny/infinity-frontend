import { cache } from 'react';
import { GetSession, GetUser, GetUserGroups } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserGroupDto,
  UserGroupMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserGroupsList,
  UserGroupsToolbar,
} from '@app/presentation/components/internal/user-groups';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['read-user-group'].some((p) => userPermissions.has(p)) ||
    (['read-own-user-group'].some((p) => userPermissions.has(p)) && userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const userId = (await params).userId;

    const userResult = await cache(async () => await getUser.execute(userId))();
    const user = match(userResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return {
      title: `${user.name}'s Groups`,
    };
  } else {
    notFound();
  }
}

export default async function UserGroupsPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['read-user-group'].some((p) => userPermissions.has(p)) ||
    (['read-own-user-group'].some((p) => userPermissions.has(p)) && userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const getUserGroups = serverContainer.get<GetUserGroups>(SYMBOLS.GetUserGroups);

    const [userResult, userGroupsResult] = await Promise.all([
      cache(async () => await getUser.execute(userId))(),
      getUserGroups.execute(userId, undefined, undefined, { perPage: 25 }),
    ]);
    const user = match(userResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });
    const [userGroups, paginationOptions] = match(userGroupsResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Users', url: '/users' },
          { label: user.name, url: `/users/${userId}` },
          { label: 'Groups', url: `/users/${userId}/groups` },
        ]}
      >
        <SectionHeader title={`${user.name}'s Groups`} backUrl={`/users/${userId}`}>
          <UserGroupsToolbar userId={userId} />
        </SectionHeader>
        <UserGroupsList
          userId={userId}
          initialUserGroups={userGroups.map(UserGroupMapper.fromDomainToDto) as UserGroupDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
