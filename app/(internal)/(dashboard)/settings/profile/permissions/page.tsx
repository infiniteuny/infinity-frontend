import { GetSession, GetUser, GetUserPermissions } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
  UserPermissionDto,
  UserPermissionMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserPermissionsList } from '@app/presentation/components/internal/user-permissions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Permissions',
};

export default async function ProfilePermissionsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserPermissions = serverContainer.get<GetUserPermissions>(SYMBOLS.GetUserPermissions);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });

  const userResult = await getUser.execute(session.user.id);
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

  const userPermissionsResult = await getUserPermissions.execute(user.id, undefined, undefined, {
    perPage: 25,
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
        { label: 'Settings', url: '/settings' },
        { label: 'Profile', url: '/settings/profile' },
        { label: 'Permissions', url: '/settings/profile/permissions' },
      ]}
    >
      <UserPermissionsList
        initialUserPermissions={
          userPermissions.map(UserPermissionMapper.fromDomainToDto) as UserPermissionDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
        user={UserMapper.fromDomainToDto(user) as UserDto}
      />
    </InternalMain>
  );
}
