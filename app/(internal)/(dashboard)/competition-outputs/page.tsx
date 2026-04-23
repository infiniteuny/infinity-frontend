import {
  CompetitionOutputsList,
  CompetitionOutputsToolbar,
} from '@app/presentation/components/internal/competition-outputs';
import { GetCompetitionOutputs } from '@app/application';
import {
  CompetitionOutputDto,
  CompetitionOutputMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CompetitionOutputsPage() {
  const getCompetitionOutputs = serverContainer.get<GetCompetitionOutputs>(
    SYMBOLS.GetCompetitionOutputs,
  );
  const result = await getCompetitionOutputs.execute(undefined, { perPage: 25 });
  const [competitionOutputs, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Competition Outputs">
        <CompetitionOutputsToolbar />
      </SectionHeader>
      <CompetitionOutputsList
        initialCompetitionOutputs={
          competitionOutputs.map(CompetitionOutputMapper.fromDomaintoDto) as CompetitionOutputDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
