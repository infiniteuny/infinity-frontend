'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
  teamId: string;
  leaderId: string;
};

export function TeamMembersToolbar({ teamId, leaderId, dataGridApiRef }: Props) {
  const session = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={
        ['create-team-member'].some((p) => userPermissions.has(p)) ||
        (['create-own-team-member'].some((p) => userPermissions.has(p)) &&
          leaderId === session?.user.id)
      }
      createHref={`/teams/${teamId}/members/new`}
      createAriaLabel="Add team member"
    />
  );
}
