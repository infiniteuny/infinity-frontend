import { Competition } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competition: Competition;
};

export function MetadataView({ competition }: Props) {
  return (
    <EntityMetadataView
      id={competition.id}
      createdAt={competition.createdAt}
      updatedAt={competition.updatedAt}
    />
  );
}
