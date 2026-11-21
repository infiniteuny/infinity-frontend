'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  userId: string;
  isProfileView?: boolean;
};

export function UserCommunityGroupsToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-community-group-member', 'create-own-community-group-member'].some((p) =>
        userPermissions.has(p),
      )}
      createHref={
        isProfileView
          ? '/settings/profile/community-groups/new'
          : `/users/${userId}/community-groups/new`
      }
      createAriaLabel="Add user community group"
    />
  );
}
