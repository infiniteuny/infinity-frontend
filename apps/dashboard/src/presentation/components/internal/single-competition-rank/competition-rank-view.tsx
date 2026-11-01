'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionRankDto, CompetitionRankMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialCompetitionRank: CompetitionRankDto;
};

export function CompetitionRankView({ initialCompetitionRank }: Props) {
  const competitionRank = CompetitionRankMapper.fromDtoToDomain(initialCompetitionRank);

  return (
    <>
      <GeneralView competitionRank={competitionRank} />
      <MetadataView competitionRank={competitionRank} />
    </>
  );
}
