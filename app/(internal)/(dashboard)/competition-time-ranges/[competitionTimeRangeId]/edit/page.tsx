import { GetCompetitionTimeRange } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import { CompetitionTimeRangeForm } from '@app/presentation/components/internal/single-competition-time-range';

type Props = {
  params: Promise<{
    competitionTimeRangeId: string;
  }>;
};

export default async function SingleCompetitionTimeRangeEditPage({ params }: Props) {
  const getCompetitionTimeRange = serverContainer.get<GetCompetitionTimeRange>(
    SYMBOLS.GetCompetitionTimeRange,
  );
  const competitionTimeRangeId = (await params).competitionTimeRangeId;

  const competitionTimeRangeResult = await getCompetitionTimeRange.execute(competitionTimeRangeId);
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
    <CompetitionTimeRangeForm
      initialCompetitionTimeRange={
        CompetitionTimeRangeMapper.fromDomaintoDto(competitionTimeRange) as CompetitionTimeRangeDto
      }
    />
  );
}
