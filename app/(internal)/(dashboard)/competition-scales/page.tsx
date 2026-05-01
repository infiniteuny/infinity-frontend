import {
  CompetitionScalesList,
  CompetitionScalesToolbar,
} from '@app/presentation/components/internal/competition-scales';
import { GetCompetitionScales } from '@app/application';
import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CompetitionScalesPage() {
  const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
    SYMBOLS.GetCompetitionScales,
  );
  const result = await getCompetitionScales.execute(undefined, { perPage: 25 });
  const [competitionScales, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competition Scales">
        <CompetitionScalesToolbar />
      </SectionHeader>
      <CompetitionScalesList
        initialCompetitionScales={
          competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
