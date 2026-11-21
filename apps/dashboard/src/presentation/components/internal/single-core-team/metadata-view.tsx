import { CoreTeam } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  coreTeam: CoreTeam;
};

export function MetadataView({ coreTeam }: Props) {
  return (
    <EntityMetadataView
      id={coreTeam.id}
      createdAt={coreTeam.createdAt}
      updatedAt={coreTeam.updatedAt}
    />
  );
}
