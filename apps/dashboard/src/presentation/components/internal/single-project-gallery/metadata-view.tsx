import { ProjectGallery } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  projectGallery: ProjectGallery;
};

export function MetadataView({ projectGallery }: Props) {
  return (
    <EntityMetadataView
      id={projectGallery.id}
      createdAt={projectGallery.createdAt}
      updatedAt={projectGallery.updatedAt}
    />
  );
}
