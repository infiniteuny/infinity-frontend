import { cache } from 'react';
import { GetSession, GetUser } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { UserPermissionForm } from '@app/presentation/components/internal/single-user-permission';

export const metadata: Metadata = {
  title: 'Add Permission',
};

export default async function ProfilePermissionNewPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['create-user-permission'].some((p) => userPermissions.has(p))) {
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
          { label: 'Permissions', url: '/settings/profile/permissions' },
          { label: 'Add', url: '/settings/profile/permissions/new' },
        ]}
      >
        <UserPermissionForm user={UserMapper.fromDomainToDto(user) as UserDto} isProfileForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
