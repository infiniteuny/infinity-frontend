'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCoreTeamDivision: CoreTeamDivisionDto;
};

export function CoreTeamDivisionView({ initialCoreTeamDivision }: Props) {
  const coreTeamDivision = CoreTeamDivisionMapper.fromDtoToDomain(initialCoreTeamDivision);

  return (
    <>
      <GeneralView coreTeamDivision={coreTeamDivision} />
      <MetadataView coreTeamDivision={coreTeamDivision} />
    </>
  );
}
