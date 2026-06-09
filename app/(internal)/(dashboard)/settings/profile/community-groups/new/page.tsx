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

export const metadata: Metadata = {
  title: 'Add Community Group',
};

export default async function ProfileCommunityGroupNewPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['create-own-community-group-member'].some((p) => userPermissions.has(p))) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

    const userResult = await cache(async () => await getUser.execute(session.user.id))();
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
          { label: 'Settings', url: '/settings' },
          { label: 'Profile', url: '/settings/profile' },
          { label: 'Community Groups', url: '/settings/profile/community-groups' },
          { label: 'Add', url: '/settings/profile/community-groups/new' },
        ]}
      >
        <UserCommunityGroupForm user={UserMapper.fromDomainToDto(user) as UserDto} isProfileForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
