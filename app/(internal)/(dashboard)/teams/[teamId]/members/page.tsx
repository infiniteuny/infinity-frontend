import { GetTeam, GetTeamMembers } from '@app/application';
import { match } from 'effect/Either';
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
  const getTeamMembers = serverContainer.get<GetTeamMembers>(SYMBOLS.GetTeamMembers);
  const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
  const teamId = (await params).teamId;

  const [teamResult, teamMembersResult] = await Promise.all([
    getTeam.execute(teamId),
    getTeamMembers.execute(teamId, ['major', 'major.faculty'], undefined, {
      perPage: 25,
    }),
  ]);

  const team = match(teamResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
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
