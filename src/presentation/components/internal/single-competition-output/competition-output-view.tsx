'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCompetitionOutput: CompetitionOutputDto;
};

export function CompetitionOutputView({ initialCompetitionOutput }: Props) {
  const competitionOutput = CompetitionOutputMapper.fromDtoToDomain(initialCompetitionOutput);

  return (
    <>
      <GeneralView competitionOutput={competitionOutput} />
      <MetadataView competitionOutput={competitionOutput} />
    </>
  );
}
