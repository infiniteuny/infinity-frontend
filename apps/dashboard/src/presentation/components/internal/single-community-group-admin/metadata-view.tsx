import { CommunityGroupAdmin } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  communityGroupAdmin: CommunityGroupAdmin;
};

export function MetadataView({ communityGroupAdmin }: Props) {
  return (
    <EntityMetadataView
      id={communityGroupAdmin.id}
      createdAt={communityGroupAdmin.createdAt}
      updatedAt={communityGroupAdmin.updatedAt}
    />
  );
}
