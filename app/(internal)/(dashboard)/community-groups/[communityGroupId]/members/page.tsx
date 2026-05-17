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
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function CommunityGroupMembersPage({ params }: Props) {
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const getCommunityGroupMembers = serverContainer.get<GetCommunityGroupMembers>(
    SYMBOLS.GetCommunityGroupMembers,
  );
  const communityGroupId = (await params).communityGroupId;

  const [communityGroupResult, communityGroupMembersResult] = await Promise.all([
    getCommunityGroup.execute(communityGroupId),
    getCommunityGroupMembers.execute(communityGroupId, ['major', 'major.faculty'], undefined, {
      perPage: 25,
    }),
  ]);

  if (isLeft(communityGroupResult)) {
    const error = communityGroupResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const [communityGroupMembers, paginationOptions] = match(communityGroupMembersResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Community Group Members">
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
    </>
  );
}
