import {
  CompetitionTeamTypesList,
  CompetitionTeamTypesToolbar,
} from '@app/presentation/components/internal/competition-team-types';
import { GetCompetitionTeamTypes } from '@app/application';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function TeamTypesPage() {
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
            CompetitionTeamTypeMapper.fromDomaintoDto,
          ) as CompetitionTeamTypeDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
