import { GetCompetitionTimeRange } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import {
  CompetitionTimeRangeForm,
  CompetitionTimeRangeToolbar,
  CompetitionTimeRangeView,
} from '@app/presentation/components/internal/single-competition-time-range';

type Props = {
  params: Promise<{
    competitionTimeRangeId: string;
  }>;
};

export default async function SingleCompetitionTimeRangePage({ params }: Props) {
  const competitionTimeRangeId = (await params).competitionTimeRangeId;

  if (competitionTimeRangeId !== 'new') {
    const getCompetitionTimeRange = serverContainer.get<GetCompetitionTimeRange>(
      SYMBOLS.GetCompetitionTimeRange,
    );
    const competitionTimeRangeResult =
      await getCompetitionTimeRange.execute(competitionTimeRangeId);
    const competitionTimeRange = match(competitionTimeRangeResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={competitionTimeRange.name}>
          <CompetitionTimeRangeToolbar competitionTimeRangeId={competitionTimeRange.id} />
        </SectionHeader>
        <CompetitionTimeRangeView
          initialCompetitionTimeRange={
            CompetitionTimeRangeMapper.fromDomaintoDto(
              competitionTimeRange,
            ) as CompetitionTimeRangeDto
          }
        />
      </>
    );
  } else {
    return <CompetitionTimeRangeForm />;
  }
}
