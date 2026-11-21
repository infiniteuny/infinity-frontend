import { CompetitionTimeRange } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionTimeRange: CompetitionTimeRange;
};

export function MetadataView({ competitionTimeRange }: Props) {
  return (
    <EntityMetadataView
      id={competitionTimeRange.id}
      createdAt={competitionTimeRange.createdAt}
      updatedAt={competitionTimeRange.updatedAt}
    />
  );
}
