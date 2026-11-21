import { CommunityGroup } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  communityGroup: CommunityGroup;
};

export function MetadataView({ communityGroup }: Props) {
  return (
    <EntityMetadataView
      id={communityGroup.id}
      createdAt={communityGroup.createdAt}
      updatedAt={communityGroup.updatedAt}
    />
  );
}
