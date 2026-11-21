import { Group } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  group: Group;
};

export function MetadataView({ group }: Props) {
  return (
    <EntityMetadataView id={group.id} createdAt={group.createdAt} updatedAt={group.updatedAt} />
  );
}
