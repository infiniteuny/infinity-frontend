import { GetSession, GetUser, GetUserGroups } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
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
import { UserGroupsList } from '@app/presentation/components/internal/user-groups';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Groups',
};

export default async function ProfileGroupsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserGroups = serverContainer.get<GetUserGroups>(SYMBOLS.GetUserGroups);

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

  const userGroupsResult = await getUserGroups.execute(user.id, undefined, undefined, {
    perPage: 25,
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
        { label: 'Settings', url: '/settings' },
        { label: 'Profile', url: '/settings/profile' },
        { label: 'Groups', url: '/settings/profile/groups' },
      ]}
    >
      <UserGroupsList
        userId={user.id}
        initialUserGroups={userGroups.map(UserGroupMapper.fromDomainToDto) as UserGroupDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
