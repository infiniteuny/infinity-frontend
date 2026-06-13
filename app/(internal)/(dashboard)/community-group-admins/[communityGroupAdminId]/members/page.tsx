import { cache } from 'react';
import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminMembersList,
  CommunityGroupAdminMembersToolbar,
} from '@app/presentation/components/internal/community-group-admin-members';
import { GetCommunityGroupAdmin, GetCommunityGroupAdminMembers } from '@app/application';
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
    communityGroupAdminId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const communityGroupAdminId = (await params).communityGroupAdminId;

  const communityGroupAdminResult = await cache(
    async () => await getCommunityGroupAdmin.execute(communityGroupAdminId),
  )();
  const communityGroupAdmin = match(communityGroupAdminResult, {
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
    title: `${communityGroupAdmin.year}'s Members`,
  };
}

export default async function CommunityGroupAdminMembersPage({ params }: Props) {
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const getCommunityGroupAdminMembers = serverContainer.get<GetCommunityGroupAdminMembers>(
    SYMBOLS.GetCommunityGroupAdminMembers,
  );
  const communityGroupAdminId = (await params).communityGroupAdminId;

  const [communityGroupAdminResult, communityGroupAdminMembersResult] = await Promise.all([
    getCommunityGroupAdmin.execute(communityGroupAdminId),
    getCommunityGroupAdminMembers.execute(
      communityGroupAdminId,
      ['major', 'major.faculty', 'membership.community_group'],
      undefined,
      undefined,
      { perPage: 25 },
    ),
  ]);

  const communityGroupAdmin = match(communityGroupAdminResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const [communityGroupAdminMembers, paginationOptions] = match(communityGroupAdminMembersResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Community Group Administrators', url: '/community-group-admins' },
        {
          label: communityGroupAdmin.year.toString(),
          url: `/community-group-admins/${communityGroupAdminId}`,
        },
        { label: 'Members', url: `/community-group-admins/${communityGroupAdminId}/members` },
      ]}
    >
      <SectionHeader
        title={`${communityGroupAdmin.year} Members`}
        backUrl={`/community-group-admins/${communityGroupAdminId}`}
      >
        <CommunityGroupAdminMembersToolbar communityGroupAdminId={communityGroupAdminId} />
      </SectionHeader>
      <CommunityGroupAdminMembersList
        communityGroupAdminId={communityGroupAdminId}
        initialCommunityGroupAdminMembers={
          communityGroupAdminMembers.map(
            CommunityGroupAdminMemberMapper.fromDomainToDto,
          ) as CommunityGroupAdminMemberDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
