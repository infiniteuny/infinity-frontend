import {
  CompetitionOrganizerTypesList,
  CompetitionOrganizerTypesToolbar,
} from '@app/presentation/components/internal/competition-organizer-types';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionOrganizerTypes } from '@app/application';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CompetitionOrganizerTypesPage() {
  const getCompetitionOrganizerTypes = serverContainer.get<GetCompetitionOrganizerTypes>(
    SYMBOLS.GetCompetitionOrganizerTypes,
  );
  const result = await getCompetitionOrganizerTypes.execute(undefined, { perPage: 25 });
  const [competitionOrganizerTypes, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competition Organizer Types">
        <CompetitionOrganizerTypesToolbar />
      </SectionHeader>
      <CompetitionOrganizerTypesList
        initialCompetitionOrganizerTypes={
          competitionOrganizerTypes.map(
            CompetitionOrganizerTypeMapper.fromDomaintoDto,
          ) as CompetitionOrganizerTypeDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
