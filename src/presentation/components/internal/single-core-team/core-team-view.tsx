'use client';

import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialCoreTeam: CoreTeamDto;
};

export function CoreTeamView({ initialCoreTeam }: Props) {
  const coreTeam = CoreTeamMapper.fromDtoToDomain(initialCoreTeam);

  return (
    <>
      <GeneralView coreTeam={coreTeam} />
      <MetadataView coreTeam={coreTeam} />
    </>
  );
}
