'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function CoreTeamsToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-core-team'].some((p) => userPermissions.has(p))}
      createHref="/core-teams/new"
      createAriaLabel="Add core team"
    />
  );
}
