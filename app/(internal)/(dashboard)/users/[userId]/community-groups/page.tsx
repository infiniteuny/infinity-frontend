import { cache } from 'react';
import { GetUser, GetUserCommunityGroups } from '@app/application';
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

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    title: `${user.name}'s Community Groups`,
  };
}

export default async function UserCommunityGroupsPage({ params }: Props) {
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserCommunityGroups = serverContainer.get<GetUserCommunityGroups>(
    SYMBOLS.GetUserCommunityGroups,
  );
  const userId = (await params).userId;

  const [userResult, userCommunityGroupsResult] = await Promise.all([
    cache(async () => await getUser.execute(userId))(),
    getUserCommunityGroups.execute(userId, undefined, { perPage: 25 }),
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
        { label: 'Users', url: '/users' },
        { label: user.name, url: `/users/${userId}` },
        { label: 'Community Groups', url: `/users/${userId}/community-groups` },
      ]}
    >
      <SectionHeader title={`${user.name}'s Community Groups`} backUrl={`/users/${userId}`}>
        <UserCommunityGroupsToolbar userId={userId} />
      </SectionHeader>
      <UserCommunityGroupsList
        userId={userId}
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
