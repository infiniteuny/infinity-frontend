'use client';

import { DataGridApiRef, EntityListToolbar } from '@app/presentation/components/internal/shared';
import { useUserPermissions } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: DataGridApiRef;
};

export function ProjectGalleriesToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

  return (
    <EntityListToolbar
      dataGridApiRef={dataGridApiRef}
      canCreate={['create-project-gallery'].some((p) => userPermissions.has(p))}
      createHref="/project-galleries/new"
      createAriaLabel="Add project gallery"
    />
  );
}
