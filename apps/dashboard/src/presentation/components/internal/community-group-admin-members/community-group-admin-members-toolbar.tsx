'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  communityGroupAdminId: string;
};

export function CommunityGroupAdminMembersToolbar({
  communityGroupAdminId,
  dataGridApiRef,
}: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-community-group-admin-member'].some((p) => userPermissions.has(p))}
      createHref={`/community-group-admins/${communityGroupAdminId}/members/new`}
      createAriaLabel="Add community group admin member"
    />
  );
}
