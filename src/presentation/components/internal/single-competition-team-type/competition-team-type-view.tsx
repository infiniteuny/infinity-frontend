'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCompetitionTeamType: CompetitionTeamTypeDto;
};

export function CompetitionTeamTypeView({ initialCompetitionTeamType }: Props) {
  const competitionTeamType = CompetitionTeamTypeMapper.fromDtoToDomain(initialCompetitionTeamType);

  return (
    <>
      <GeneralView competitionTeamType={competitionTeamType} />
      <MetadataView competitionTeamType={competitionTeamType} />
    </>
  );
}
