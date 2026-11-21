'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  communityGroupId: string;
};

export function CommunityGroupMembersToolbar({ communityGroupId, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-community-group-member', 'create-own-community-group-member'].some((p) =>
        userPermissions.has(p),
      )}
      createHref={`/community-groups/${communityGroupId}/members/new`}
      createAriaLabel="Add community group member"
    />
  );
}
