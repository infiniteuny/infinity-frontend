import { Major } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  major: Major;
};

export function MetadataView({ major }: Props) {
  return (
    <EntityMetadataView id={major.id} createdAt={major.createdAt} updatedAt={major.updatedAt} />
  );
}
