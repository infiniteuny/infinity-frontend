'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  userId: string;
  isProfileView?: boolean;
};

export function UserPersonasToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-user-persona', 'create-own-user-persona'].some((p) =>
        userPermissions.has(p),
      )}
      createHref={
        isProfileView ? '/settings/profile/personas/new' : `/users/${userId}/personas/new`
      }
      createAriaLabel="Add user persona"
    />
  );
}
