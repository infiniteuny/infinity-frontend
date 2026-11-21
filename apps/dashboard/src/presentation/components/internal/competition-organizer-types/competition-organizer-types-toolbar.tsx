'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function CompetitionOrganizerTypesToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-competition-organizer-type'].some((p) => userPermissions.has(p))}
      createHref="/competition-organizer-types/new"
      createAriaLabel="Add competition organizer type"
    />
  );
}
