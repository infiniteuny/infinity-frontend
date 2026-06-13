import { cache } from 'react';
import {
  CommunityGroupMemberMapper,
  CommunityGroupMemberDto,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CommunityGroupMembersList,
  CommunityGroupMembersToolbar,
} from '@app/presentation/components/internal/community-group-members';
import { GetCommunityGroup, GetCommunityGroupMembers } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const communityGroupId = (await params).communityGroupId;

  const communityGroupResult = await cache(
    async () => await getCommunityGroup.execute(communityGroupId),
  )();
  const communityGroup = match(communityGroupResult, {
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
    title: `${communityGroup.name}'s Members`,
  };
}

export default async function CommunityGroupMembersPage({ params }: Props) {
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const getCommunityGroupMembers = serverContainer.get<GetCommunityGroupMembers>(
    SYMBOLS.GetCommunityGroupMembers,
  );
  const communityGroupId = (await params).communityGroupId;

  const [communityGroupResult, communityGroupMembersResult] = await Promise.all([
    cache(async () => await getCommunityGroup.execute(communityGroupId))(),
    getCommunityGroupMembers.execute(
      communityGroupId,
      ['major', 'major.faculty'],
      undefined,
      undefined,
      {
        perPage: 25,
      },
    ),
  ]);

  const communityGroup = match(communityGroupResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const [communityGroupMembers, paginationOptions] = match(communityGroupMembersResult, {
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
        { label: 'Community Groups', url: '/community-groups' },
        { label: communityGroup.name, url: `/community-groups/${communityGroupId}` },
        { label: 'Members', url: `/community-groups/${communityGroupId}/members` },
      ]}
    >
      <SectionHeader
        title={`${communityGroup.name}'s Members`}
        backUrl={`/community-groups/${communityGroupId}`}
      >
        <CommunityGroupMembersToolbar communityGroupId={communityGroupId} />
      </SectionHeader>
      <CommunityGroupMembersList
        communityGroupId={communityGroupId}
        initialCommunityGroupMembers={
          communityGroupMembers.map(
            CommunityGroupMemberMapper.fromDomainToDto,
          ) as CommunityGroupMemberDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
