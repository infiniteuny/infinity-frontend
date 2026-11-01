'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionDto, CompetitionMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialCompetition: CompetitionDto;
};

export function CompetitionView({ initialCompetition }: Props) {
  const competition = CompetitionMapper.fromDtoToDomain(initialCompetition);

  return (
    <>
      <GeneralView competition={competition} />
      <MetadataView competition={competition} />
    </>
  );
}
