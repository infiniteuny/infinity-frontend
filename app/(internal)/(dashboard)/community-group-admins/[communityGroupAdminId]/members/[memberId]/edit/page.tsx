import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  CommunityGroupDto,
  CommunityGroupMapper,
} from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberForm } from '@app/presentation/components/internal/single-community-group-admin-member';
import { GetCommunityGroupAdminMember, GetCommunityGroups } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
    memberId: string;
  }>;
};

export default async function EditCommunityGroupAdminMemberPage({ params }: Props) {
  const { communityGroupAdminId, memberId } = await params;

  const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
    SYMBOLS.GetCommunityGroupAdminMember,
  );
  const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);

  const [communityGroupAdminMemberResult, communityGroupsResult] = await Promise.all([
    getCommunityGroupAdminMember.execute(memberId, ['membership.community_group']),
    getCommunityGroups.execute(undefined, { perPage: 100 }),
  ]);

  const [communityGroups] = match(communityGroupsResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const communityGroupAdminMember = match(communityGroupAdminMemberResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  return (
    <CommunityGroupAdminMemberForm
      communityGroupAdminId={communityGroupAdminId}
      initialCommunityGroupAdminMember={
        CommunityGroupAdminMemberMapper.fromDomainToDto(
          communityGroupAdminMember,
        ) as CommunityGroupAdminMemberDto
      }
      communityGroups={
        communityGroups.map(CommunityGroupMapper.fromDomainToDto) as CommunityGroupDto[]
      }
    />
  );
}
