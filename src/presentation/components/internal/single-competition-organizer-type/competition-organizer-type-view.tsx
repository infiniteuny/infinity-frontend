'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';

type Props = {
  initialCompetitionOrganizerType: CompetitionOrganizerTypeDto;
};

export function CompetitionOrganizerTypeView({ initialCompetitionOrganizerType }: Props) {
  const competitionOrganizerType = CompetitionOrganizerTypeMapper.fromDtoToDomain(
    initialCompetitionOrganizerType,
  );

  return (
    <>
      <GeneralView competitionOrganizerType={competitionOrganizerType} />
      <MetadataView competitionOrganizerType={competitionOrganizerType} />
    </>
  );
}
