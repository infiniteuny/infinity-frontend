'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionScaleDto, CompetitionScaleMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialCompetitionScale: CompetitionScaleDto;
};

export function CompetitionScaleView({ initialCompetitionScale }: Props) {
  const competitionScale = CompetitionScaleMapper.fromDtoToDomain(initialCompetitionScale);

  return (
    <>
      <GeneralView competitionScale={competitionScale} />
      <MetadataView competitionScale={competitionScale} />
    </>
  );
}
