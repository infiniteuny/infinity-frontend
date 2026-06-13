import { GetSession, GetUser, GetUserCommunityGroups } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserCommunityGroupDto,
  UserCommunityGroupMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserCommunityGroupsList,
  UserCommunityGroupsToolbar,
} from '@app/presentation/components/internal/user-community-groups';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Community Groups',
};

export default async function ProfileCommunityGroupsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserCommunityGroups = serverContainer.get<GetUserCommunityGroups>(
    SYMBOLS.GetUserCommunityGroups,
  );

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

  const userCommunityGroupsResult = await getUserCommunityGroups.execute(
    user.id,
    undefined,
    undefined,
    {
      perPage: 25,
    },
  );
  const [userCommunityGroups, paginationOptions] = match(userCommunityGroupsResult, {
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
        { label: 'Community Groups', url: '/settings/profile/community-groups' },
      ]}
    >
      <SectionHeader title="My Community Groups" backUrl="/settings/profile">
        <UserCommunityGroupsToolbar userId={user.id} isProfileView />
      </SectionHeader>
      <UserCommunityGroupsList
        userId={user.id}
        initialUserCommunityGroups={
          userCommunityGroups.map(
            UserCommunityGroupMapper.fromDomainToDto,
          ) as UserCommunityGroupDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
