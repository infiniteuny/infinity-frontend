'use client';

import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialGroup: GroupDto;
};

export function GroupView({ initialGroup }: Props) {
  const group = GroupMapper.fromDtoToDomain(initialGroup);

  return (
    <>
      <GeneralView group={group} />
      <MetadataView group={group} />
    </>
  );
}
