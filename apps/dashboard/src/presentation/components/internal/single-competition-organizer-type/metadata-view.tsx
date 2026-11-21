import { CompetitionOrganizerType } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionOrganizerType: CompetitionOrganizerType;
};

export function MetadataView({ competitionOrganizerType }: Props) {
  return (
    <EntityMetadataView
      id={competitionOrganizerType.id}
      createdAt={competitionOrganizerType.createdAt}
      updatedAt={competitionOrganizerType.updatedAt}
    />
  );
}
