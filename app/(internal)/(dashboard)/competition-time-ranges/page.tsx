import {
  CompetitionTimeRangesList,
  CompetitionTimeRangesToolbar,
} from '@app/presentation/components/internal/competition-time-ranges';
import { GetCompetitionTimeRanges } from '@app/application';
import {
  CompetitionTimeRangeDto,
  CompetitionTimeRangeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CompetitionTimeRangesPage() {
  const getCompetitionTimeRanges = serverContainer.get<GetCompetitionTimeRanges>(
    SYMBOLS.GetCompetitionTimeRanges,
  );
  const result = await getCompetitionTimeRanges.execute(undefined, { perPage: 25 });
  const [competitionTimeRanges, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competition Time Ranges">
        <CompetitionTimeRangesToolbar />
      </SectionHeader>
      <CompetitionTimeRangesList
        initialCompetitionTimeRanges={
          competitionTimeRanges.map(
            CompetitionTimeRangeMapper.fromDomaintoDto,
          ) as CompetitionTimeRangeDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
