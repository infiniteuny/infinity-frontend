import {
  CoreTeamMembersList,
  CoreTeamMembersToolbar,
} from '@app/presentation/components/internal/core-team-members';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { GetCoreTeam, GetCoreTeamMembers } from '@app/application';
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export default async function CoreTeamMembersPage({ params }: Props) {
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const getCoreTeamMembers = serverContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers);
  const coreTeamId = (await params).coreTeamId;

  const [coreTeamResult, coreTeamMembersResult] = await Promise.all([
    getCoreTeam.execute(coreTeamId),
    getCoreTeamMembers.execute(
      coreTeamId,
      ['major', 'major.faculty', 'membership.core_team_division'],
      undefined,
      { perPage: 25 },
    ),
  ]);

  if (isLeft(coreTeamResult)) {
    const error = coreTeamResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const [coreTeamMembers, paginationOptions] = match(coreTeamMembersResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Core Team Members">
        <CoreTeamMembersToolbar coreTeamId={coreTeamId} />
      </SectionHeader>
      <CoreTeamMembersList
        coreTeamId={coreTeamId}
        initialCoreTeamMembers={
          coreTeamMembers.map(CoreTeamMemberMapper.fromDomainToDto) as CoreTeamMemberDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
