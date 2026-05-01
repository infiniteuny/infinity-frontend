import { GetCommunityGroupAdminMembers } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CommunityGroupAdminMembersList,
  CommunityGroupAdminMembersToolbar,
} from '@app/presentation/components/internal/community-group-admin-members';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export default async function CommunityGroupAdminMembersPage({ params }: Props) {
  const getCommunityGroupAdminMembers = serverContainer.get<GetCommunityGroupAdminMembers>(
    SYMBOLS.GetCommunityGroupAdminMembers,
  );
  const communityGroupAdminId = (await params).communityGroupAdminId;
  const result = await getCommunityGroupAdminMembers.execute(
    communityGroupAdminId,
    ['major', 'major.faculty', 'membership.community_group'],
    undefined,
    { perPage: 25 },
  );
  const [communityGroupAdminMembers, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Community Group Admin Members">
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
    </>
  );
}
