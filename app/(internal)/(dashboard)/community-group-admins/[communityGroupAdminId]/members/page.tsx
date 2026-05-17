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
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

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
      { perPage: 25 },
    ),
  ]);

  if (isLeft(communityGroupAdminResult)) {
    const error = communityGroupAdminResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const [communityGroupAdminMembers, paginationOptions] = match(communityGroupAdminMembersResult, {
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
