'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function MajorsToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-major'].some((p) => userPermissions.has(p))}
      createHref="/majors/new"
      createAriaLabel="Add major"
    />
  );
}
