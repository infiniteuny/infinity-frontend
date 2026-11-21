import { CompetitionRank } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionRank: CompetitionRank;
};

export function MetadataView({ competitionRank }: Props) {
  return (
    <EntityMetadataView
      id={competitionRank.id}
      createdAt={competitionRank.createdAt}
      updatedAt={competitionRank.updatedAt}
    />
  );
}
