import { CompetitionOutput } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  competitionOutput: CompetitionOutput;
};

export function MetadataView({ competitionOutput }: Props) {
  return (
    <EntityMetadataView
      id={competitionOutput.id}
      createdAt={competitionOutput.createdAt}
      updatedAt={competitionOutput.updatedAt}
    />
  );
}
