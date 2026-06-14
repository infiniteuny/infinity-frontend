import {
  CompetitionDto,
  CompetitionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { CompetitionsList } from '@app/presentation/components/internal/competitions';
import { GetCompetitions } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competitions',
};

export default async function CompetitionsPage() {
  const getCompetitions = serverContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions);

  const result = await getCompetitions.execute(undefined, undefined, { perPage: 25 });
  const [competitions, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Settings', url: '/settings' },
        { label: 'Competitions', url: '/competitions' },
      ]}
    >
      <CompetitionsList
        initialCompetitions={
          competitions.map(CompetitionMapper.fromDomainToDto) as CompetitionDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
