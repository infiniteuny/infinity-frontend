'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { TeamDto, TeamMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialTeam: TeamDto;
};

export function TeamView({ initialTeam }: Props) {
  const team = TeamMapper.fromDtoToDomain(initialTeam);

  return (
    <>
      <GeneralView team={team} />
      <MetadataView team={team} />
    </>
  );
}
