import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CompetitionTeamTypesList,
  CompetitionTeamTypesToolbar,
} from '@app/presentation/components/internal/competition-team-types';
import { GetCompetitionTeamTypes, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function TeamTypesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-competition-team-type'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );

    const result = await getCompetitionTeamTypes.execute(undefined, { perPage: 25 });
    const [competitionTeamTypes, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Team Types">
          <CompetitionTeamTypesToolbar />
        </SectionHeader>
        <CompetitionTeamTypesList
          initialCompetitionTeamTypes={
            competitionTeamTypes.map(
              CompetitionTeamTypeMapper.fromDomainToDto,
            ) as CompetitionTeamTypeDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
