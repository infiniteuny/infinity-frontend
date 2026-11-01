'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { PermissionDto, PermissionMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialPermission: PermissionDto;
};

export function PermissionView({ initialPermission }: Props) {
  const permission = PermissionMapper.fromDtoToDomain(initialPermission);

  return (
    <>
      <GeneralView permission={permission} />
      <MetadataView pemission={permission} />
    </>
  );
}
