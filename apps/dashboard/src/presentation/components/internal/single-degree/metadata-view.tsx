import { Degree } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  degree: Degree;
};

export function MetadataView({ degree }: Props) {
  return (
    <EntityMetadataView id={degree.id} createdAt={degree.createdAt} updatedAt={degree.updatedAt} />
  );
}
