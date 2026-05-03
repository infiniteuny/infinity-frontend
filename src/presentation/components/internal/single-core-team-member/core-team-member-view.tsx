'use client';

import { CoreTeamMemberDto, CoreTeamMemberMapper } from '@app/infrastructure/dtos';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialCoreTeamMember: CoreTeamMemberDto;
};

export function CoreTeamMemberView({ initialCoreTeamMember }: Props) {
  const coreTeamMember = CoreTeamMemberMapper.fromDtoToDomain(initialCoreTeamMember);

  return (
    <>
      <GeneralView coreTeamMember={coreTeamMember} />
      <MetadataView coreTeamMember={coreTeamMember} />
    </>
  );
}
