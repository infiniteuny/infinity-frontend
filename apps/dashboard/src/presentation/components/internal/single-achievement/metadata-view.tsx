import { Achievement } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  achievement: Achievement;
};

export function MetadataView({ achievement }: Props) {
  return (
    <EntityMetadataView
      id={achievement.id}
      createdAt={achievement.createdAt}
      updatedAt={achievement.updatedAt}
    />
  );
}
