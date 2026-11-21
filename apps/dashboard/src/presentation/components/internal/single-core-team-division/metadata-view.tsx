import { CoreTeamDivision } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  coreTeamDivision: CoreTeamDivision;
};

export function MetadataView({ coreTeamDivision }: Props) {
  return (
    <EntityMetadataView
      id={coreTeamDivision.id}
      createdAt={coreTeamDivision.createdAt}
      updatedAt={coreTeamDivision.updatedAt}
    />
  );
}
