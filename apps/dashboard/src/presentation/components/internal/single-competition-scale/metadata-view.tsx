import { CompetitionScale } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionScale: CompetitionScale;
};

export function MetadataView({ competitionScale }: Props) {
  return (
    <EntityMetadataView
      id={competitionScale.id}
      createdAt={competitionScale.createdAt}
      updatedAt={competitionScale.updatedAt}
    />
  );
}
