'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCompetitionTimeRange: CompetitionTimeRangeDto;
};

export function CompetitionTimeRangeView({ initialCompetitionTimeRange }: Props) {
  const competitionTimeRange = CompetitionTimeRangeMapper.fromDtoToDomain(
    initialCompetitionTimeRange,
  );

  return (
    <>
      <GeneralView competitionTimeRange={competitionTimeRange} />
      <MetadataView competitionTimeRange={competitionTimeRange} />
    </>
  );
}
