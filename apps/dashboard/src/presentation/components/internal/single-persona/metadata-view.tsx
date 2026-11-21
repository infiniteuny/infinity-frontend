import { Persona } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  persona: Persona;
};

export function MetadataView({ persona }: Props) {
  return (
    <EntityMetadataView
      id={persona.id}
      createdAt={persona.createdAt}
      updatedAt={persona.updatedAt}
    />
  );
}
