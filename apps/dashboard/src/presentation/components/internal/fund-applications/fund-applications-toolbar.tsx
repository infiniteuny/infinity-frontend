'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function FundApplicationsToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-fund-application', 'create-own-fund-application'].some((p) =>
        userPermissions.has(p),
      )}
      createHref="/fund-applications/new"
      createAriaLabel="Add fund application"
    />
  );
}
