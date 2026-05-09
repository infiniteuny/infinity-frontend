import { GetSession, GetTeam, GetTeamMembers } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TeamDto,
  TeamMapper,
  TeamMemberDto,
  TeamMemberMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TeamMembersList,
  TeamMembersToolbar,
} from '@app/presentation/components/internal/team-members';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function TeamMembersPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
  const teamId = (await params).teamId;

  const [teamResult, sessionResult] = await Promise.all([
    getTeam.execute(teamId),
    getSession.execute(),
  ]);

  const team = match(teamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    !(
      ['read-team-member'].some((p) => userPermissions.has(p)) ||
      (['read-own-team-member'].some((p) => userPermissions.has(p)) &&
        team.members?.some((member) => member.id === session.user.id))
    )
  ) {
    notFound();
  } else {
    const getTeamMembers = serverContainer.get<GetTeamMembers>(SYMBOLS.GetTeamMembers);

    const teamMembersResult = await getTeamMembers.execute(
      teamId,
      ['major', 'major.faculty'],
      undefined,
      { perPage: 25 },
    );
    const [teamMembers, paginationOptions] = match(teamMembersResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Team Members">
          <TeamMembersToolbar teamId={teamId} />
        </SectionHeader>
        <TeamMembersList
          team={TeamMapper.fromDomainToDto(team) as TeamDto}
          initialTeamMembers={teamMembers.map(TeamMemberMapper.fromDomainToDto) as TeamMemberDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
