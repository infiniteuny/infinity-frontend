'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function CompetitionTimeRangesToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-competition-time-range'].some((p) => userPermissions.has(p))}
      createHref="/competition-time-ranges/new"
      createAriaLabel="Add competition time range"
    />
  );
}
