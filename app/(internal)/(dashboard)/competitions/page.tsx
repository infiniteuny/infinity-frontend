import { GetCompetitions } from '@app/application';
import { match } from 'effect/Either';
import {
  CompetitionDto,
  CompetitionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionsList,
  CompetitionsToolbar,
} from '@app/presentation/components/internal/competitions';

export const dynamic = 'force-dynamic';

export default async function CompetitionsPage() {
  const getCompetitions = serverContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions);
  const result = await getCompetitions.execute(undefined, { perPage: 25 });
  const [competitions, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competitions">
        <CompetitionsToolbar />
      </SectionHeader>
      <CompetitionsList
        initialCompetitions={
          competitions.map(CompetitionMapper.fromDomainToDto) as CompetitionDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
