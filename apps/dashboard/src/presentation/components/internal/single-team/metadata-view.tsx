import { Team } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  team: Team;
};

export function MetadataView({ team }: Props) {
  return <EntityMetadataView id={team.id} createdAt={team.createdAt} updatedAt={team.updatedAt} />;
}
