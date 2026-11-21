import { CompetitionTeamType } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionTeamType: CompetitionTeamType;
};

export function MetadataView({ competitionTeamType }: Props) {
  return (
    <EntityMetadataView
      id={competitionTeamType.id}
      createdAt={competitionTeamType.createdAt}
      updatedAt={competitionTeamType.updatedAt}
    />
  );
}
