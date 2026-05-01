import { GetCompetitionTeamTypes, GetTeam } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TeamDto,
  TeamMapper,
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
} from '@app/infrastructure/dtos';
import { TeamForm, TeamToolbar, TeamView } from '@app/presentation/components/internal/single-team';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function SingleTeamPage({ params }: Props) {
  const teamId = (await params).teamId;

  if (teamId !== 'new') {
    const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
    const teamResult = await getTeam.execute(teamId, ['leader', 'team_type']);
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

    return (
      <>
        <SectionHeader title={team.name}>
          <TeamToolbar teamId={team.id} />
        </SectionHeader>
        <TeamView initialTeam={TeamMapper.fromDomainToDto(team) as TeamDto} />
      </>
    );
  } else {
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );
    const teamTypesResult = await getCompetitionTeamTypes.execute(undefined, {
      perPage: 100,
    });
    const [teamTypes] = match(teamTypesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <TeamForm
        teamTypes={
          teamTypes.map(CompetitionTeamTypeMapper.fromDomainToDto) as CompetitionTeamTypeDto[]
        }
      />
    );
  }
}
