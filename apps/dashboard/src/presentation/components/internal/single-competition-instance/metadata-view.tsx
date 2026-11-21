import { CompetitionInstance } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionInstance: CompetitionInstance;
};

export function MetadataView({ competitionInstance }: Props) {
  return (
    <EntityMetadataView
      id={competitionInstance.id}
      createdAt={competitionInstance.createdAt}
      updatedAt={competitionInstance.updatedAt}
    />
  );
}
