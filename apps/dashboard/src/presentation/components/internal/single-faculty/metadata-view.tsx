import { Faculty } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  faculty: Faculty;
};

export function MetadataView({ faculty }: Props) {
  return (
    <EntityMetadataView
      id={faculty.id}
      createdAt={faculty.createdAt}
      updatedAt={faculty.updatedAt}
    />
  );
}
