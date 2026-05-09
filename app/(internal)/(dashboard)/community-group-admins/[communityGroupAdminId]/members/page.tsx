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
import {
  GetCommunityGroupAdmin,
  GetCommunityGroupAdminMembers,
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
  }>;
};

export default async function CommunityGroupAdminMembersPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const communityGroupAdminId = (await params).communityGroupAdminId;

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

  if (['read-community-group-admin-member'].some((p) => userPermissions.has(p))) {
    const getCommunityGroupAdminMembers = serverContainer.get<GetCommunityGroupAdminMembers>(
      SYMBOLS.GetCommunityGroupAdminMembers,
    );

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
  } else {
    notFound();
  }
}
