'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  userId: string;
  isProfileView?: boolean;
};

export function UserPermissionsToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-user-permission'].some((p) => userPermissions.has(p))}
      createHref={
        isProfileView ? '/settings/profile/permissions/new' : `/users/${userId}/permissions/new`
      }
      createAriaLabel="Add user permission"
    />
  );
}
