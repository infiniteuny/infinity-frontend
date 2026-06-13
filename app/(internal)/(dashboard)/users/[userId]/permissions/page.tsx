import { GetSession, GetUser, GetUserPermissions } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserPermissionDto,
  UserPermissionMapper,
} from '@app/infrastructure/dtos';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserPermissionsList,
  UserPermissionsToolbar,
} from '@app/presentation/components/internal/user-permissions';
import { cache } from 'react';

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
    ['read-user-permission'].some((p) => userPermissions.has(p)) ||
    (['read-own-user-permission'].some((p) => userPermissions.has(p)) && userId === session.user.id)
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
      title: `${user.name}'s Permissions`,
    };
  } else {
    notFound();
  }
}

export default async function UserPermissionsPage({ params }: Props) {
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
    ['read-user-permission'].some((p) => userPermissions.has(p)) ||
    (['read-own-user-permission'].some((p) => userPermissions.has(p)) && userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const getUserPermissions = serverContainer.get<GetUserPermissions>(SYMBOLS.GetUserPermissions);

    const [userResult, userPermissionsResult] = await Promise.all([
      cache(async () => await getUser.execute(userId))(),
      getUserPermissions.execute(userId, undefined, undefined, { perPage: 25 }),
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
    const [userPermissions, paginationOptions] = match(userPermissionsResult, {
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
          { label: 'Permissions', url: `/users/${userId}/permissions` },
        ]}
      >
        <SectionHeader title={`${user.name}'s Permissions`} backUrl={`/users/${userId}`}>
          <UserPermissionsToolbar userId={userId} />
        </SectionHeader>
        <UserPermissionsList
          userId={userId}
          initialUserPermissions={
            userPermissions.map(UserPermissionMapper.fromDomainToDto) as UserPermissionDto[]
          }
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
