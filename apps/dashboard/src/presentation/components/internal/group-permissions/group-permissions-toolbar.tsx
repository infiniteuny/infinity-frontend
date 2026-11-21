'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  groupId: string;
};

export function GroupPermissionsToolbar({ groupId, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-group-permission'].some((p) => userPermissions.has(p))}
      createHref={`/groups/${groupId}/permissions/new`}
      createAriaLabel="Add group permission"
    />
  );
}
