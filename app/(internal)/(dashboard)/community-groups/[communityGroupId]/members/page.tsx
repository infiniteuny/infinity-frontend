import { GetCommunityGroupMembers } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  CommunityGroupMemberDto,
  CommunityGroupMemberMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CommunityGroupMembersList,
  CommunityGroupMembersToolbar,
} from '@app/presentation/components/internal/community-group-members';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function CommunityGroupMembersPage({ params }: Props) {
  const getCommunityGroupMembers = serverContainer.get<GetCommunityGroupMembers>(
    SYMBOLS.GetCommunityGroupMembers,
  );
  const communityGroupId = (await params).communityGroupId;
  const result = await getCommunityGroupMembers.execute(
    communityGroupId,
    ['major', 'major.faculty'],
    undefined,
    {
      perPage: 25,
    },
  );
  const [communityGroupMembers, paginationOptions] = match(result, {
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
