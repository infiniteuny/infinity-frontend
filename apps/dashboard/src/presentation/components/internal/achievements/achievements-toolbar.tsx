'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function AchievementsToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-achievement', 'create-own-achievement'].some((p) =>
        userPermissions.has(p),
      )}
      createHref="/achievements/new"
      createAriaLabel="Add achievement"
    />
  );
}
