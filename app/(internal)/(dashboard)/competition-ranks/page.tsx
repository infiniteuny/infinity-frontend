import {
  CompetitionRanksList,
  CompetitionRanksToolbar,
} from '@app/presentation/components/internal/competition-ranks';
import { GetCompetitionRanks } from '@app/application';
import {
  CompetitionRankDto,
  CompetitionRankMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CompetitionRanksPage() {
  const getCompetitionRanks = serverContainer.get<GetCompetitionRanks>(SYMBOLS.GetCompetitionRanks);
  const result = await getCompetitionRanks.execute(undefined, { perPage: 25 });
  const [competitionRanks, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competition Ranks">
        <CompetitionRanksToolbar />
      </SectionHeader>
      <CompetitionRanksList
        initialCompetitionRanks={
          competitionRanks.map(CompetitionRankMapper.fromDomaintoDto) as CompetitionRankDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
