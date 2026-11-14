import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@infiniteuny/infinity-infrastructure';
import { CompetitionInstancesList } from '@app/presentation/components/internal/competition-instances';
import { GetCompetitionInstances } from '@infiniteuny/infinity-application';
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
  const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
    SYMBOLS.GetCompetitionInstances,
  );

  const result = await getCompetitionInstances.execute(
    ['competition', 'organizer_type'],
    undefined,
    undefined,
    { perPage: 25 },
  );
  const [competitionInstances, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Competitions', url: '/competitions' },
      ]}
    >
      <CompetitionInstancesList
        initialCompetitionInstances={
          competitionInstances.map(
            CompetitionInstanceMapper.fromDomainToDto,
          ) as CompetitionInstanceDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
