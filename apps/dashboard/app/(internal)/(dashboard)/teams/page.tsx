import { GetCompetitionTeamTypes, GetSession, GetTeams } from '@infiniteuny/infinity-application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TeamDto,
  TeamMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { APP, SYMBOLS } from '@config';
import { TeamsList } from '@app/presentation/components/internal/teams';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Teams',
};

export default async function TeamsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-team', 'read-own-team'].some((p) => userPermissions.has(p))) {
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );
    const getTeams = serverContainer.get<GetTeams>(SYMBOLS.GetTeams);

    const teamTypesResult = await getCompetitionTeamTypes.execute(undefined, undefined, {
      perPage: 100,
    });
    const [teamTypes] = match(teamTypesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    const defaultTeamTypeIdFilter = teamTypes
      .filter((teamType) => teamType.id !== APP.internal.individualTeamTypeId)
      .map((teamType) => teamType.id)
      .join(',');

    const result = await getTeams.execute(
      ['leader', 'team_type'],
      { teamTypeId: defaultTeamTypeIdFilter },
      undefined,
      {
        perPage: 25,
      },
    );
    const [teams, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Teams', url: '/teams' },
        ]}
      >
        <TeamsList
          initialTeams={teams.map(TeamMapper.fromDomainToDto) as TeamDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
          defaultTeamTypeIdFilter={defaultTeamTypeIdFilter}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
