'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  userId: string;
  isProfileView?: boolean;
};

export function UserGroupsToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-user-group'].some((p) => userPermissions.has(p))}
      createHref={isProfileView ? '/settings/profile/groups/new' : `/users/${userId}/groups/new`}
      createAriaLabel="Add user group"
    />
  );
}
