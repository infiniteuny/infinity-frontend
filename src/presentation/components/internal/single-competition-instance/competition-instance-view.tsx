'use client';

import { AttachmentView } from './attachment-view';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionInstanceDto, CompetitionInstanceMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCompetitionInstance: CompetitionInstanceDto;
};

export function CompetitionInstanceView({ initialCompetitionInstance }: Props) {
  const competitionInstance = CompetitionInstanceMapper.fromDtoToDomain(initialCompetitionInstance);

  return (
    <>
      <GeneralView competitionInstance={competitionInstance} />
      <AttachmentView competitionInstance={competitionInstance} />
      <MetadataView competitionInstance={competitionInstance} />
    </>
  );
}
