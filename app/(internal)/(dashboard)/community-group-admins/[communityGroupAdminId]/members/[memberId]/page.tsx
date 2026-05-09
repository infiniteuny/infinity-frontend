import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  CommunityGroupDto,
  CommunityGroupMapper,
} from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminMemberForm,
  CommunityGroupAdminMemberToolbar,
  CommunityGroupAdminMemberView,
} from '@app/presentation/components/internal/single-community-group-admin-member';
import {
  GetCommunityGroupAdmin,
  GetCommunityGroupAdminMember,
  GetCommunityGroups,
  GetSession,
} from '@app/application';
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
    memberId: string;
  }>;
};

export default async function SingleCommunityGroupAdminMemberPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const { communityGroupAdminId, memberId } = await params;

  const [communityGroupAdminResult, sessionResult] = await Promise.all([
    getCommunityGroupAdmin.execute(communityGroupAdminId),
    getSession.execute(),
  ]);

  if (isLeft(communityGroupAdminResult)) {
    const error = communityGroupAdminResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    memberId !== 'new' &&
    ['read-community-group-admin-member'].some((p) => userPermissions.has(p))
  ) {
    const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
      SYMBOLS.GetCommunityGroupAdminMember,
    );
    const communityGroupAdminMemberResult = await getCommunityGroupAdminMember.execute(memberId, [
      'major',
      'major.faculty',
      'membership.community_group',
    ]);
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
      <>
        <SectionHeader title={communityGroupAdminMember.name}>
          <CommunityGroupAdminMemberToolbar
            communityGroupAdminId={communityGroupAdminId}
            communityGroupAdminMemberId={communityGroupAdminMember.id}
          />
        </SectionHeader>
        <CommunityGroupAdminMemberView
          initialCommunityGroupAdminMember={
            CommunityGroupAdminMemberMapper.fromDomainToDto(
              communityGroupAdminMember,
            ) as CommunityGroupAdminMemberDto
          }
        />
      </>
    );
  } else if (
    memberId === 'new' &&
    ['create-community-group-admin-member'].some((p) => userPermissions.has(p))
  ) {
    const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);

    const communityGroupsResult = await getCommunityGroups.execute(undefined, { perPage: 100 });
    const [communityGroups] = match(communityGroupsResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <CommunityGroupAdminMemberForm
        communityGroupAdminId={communityGroupAdminId}
        communityGroups={
          communityGroups.map(CommunityGroupMapper.fromDomainToDto) as CommunityGroupDto[]
        }
      />
    );
  } else {
    notFound();
  }
}
