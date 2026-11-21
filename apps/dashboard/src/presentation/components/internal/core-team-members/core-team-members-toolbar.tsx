'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  coreTeamId: string;
};

export function CoreTeamMembersToolbar({ coreTeamId, dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-core-team-member'].some((p) => userPermissions.has(p))}
      createHref={`/core-teams/${coreTeamId}/members/new`}
      createAriaLabel="Add core team member"
    />
  );
}
