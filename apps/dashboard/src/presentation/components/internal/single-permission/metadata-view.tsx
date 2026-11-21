import { Permission } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  pemission: Permission;
};

export function MetadataView({ pemission }: Props) {
  return (
    <EntityMetadataView
      id={pemission.id}
      createdAt={pemission.createdAt}
      updatedAt={pemission.updatedAt}
    />
  );
}
