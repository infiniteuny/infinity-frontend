import { cache } from 'react';
import { GetSession, GetUser } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserCommunityGroupForm } from '@app/presentation/components/internal/single-user-community-group';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';

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
    ['create-community-group-member'].some((p) => userPermissions.has(p)) ||
    (['create-own-community-group-member'].some((p) => userPermissions.has(p)) &&
      userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

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
      title: `Add ${user.name}'s Community Group`,
    };
  } else {
    notFound();
  }
}

export default async function SingleUserCommunityGroupNewPage({ params }: Props) {
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
    ['create-community-group-member'].some((p) => userPermissions.has(p)) ||
    (['create-own-community-group-member'].some((p) => userPermissions.has(p)) &&
      userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Users', url: '/users' },
          { label: user.name, url: `/users/${userId}` },
          { label: 'Community Groups', url: `/users/${userId}/community-groups` },
          { label: 'Add', url: `/users/${userId}/community-groups/new` },
        ]}
      >
        <UserCommunityGroupForm user={UserMapper.fromDomainToDto(user) as UserDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
