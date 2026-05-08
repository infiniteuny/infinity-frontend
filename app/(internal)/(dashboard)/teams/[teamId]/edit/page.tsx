import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
  TeamDto,
  TeamMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionTeamTypes, GetSession, GetTeam } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { TeamForm } from '@app/presentation/components/internal/single-team';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function SingleTeamEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-team', 'update-own-team'].some((p) => userPermissions.has(p))) {
    const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );
    const teamId = (await params).teamId;

    const teamResult = await getTeam.execute(teamId, ['leader']);
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

    if (
      !['update-team'].some((p) => userPermissions.has(p)) &&
      !team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    const teamTypesResult = await getCompetitionTeamTypes.execute(undefined, {
      perPage: 10,
    });
    const [teamTypes] = match(teamTypesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <TeamForm
        initialTeam={TeamMapper.fromDomainToDto(team) as TeamDto}
        teamTypes={
          teamTypes.map(CompetitionTeamTypeMapper.fromDomainToDto) as CompetitionTeamTypeDto[]
        }
      />
    );
  } else {
    notFound();
  }
}
