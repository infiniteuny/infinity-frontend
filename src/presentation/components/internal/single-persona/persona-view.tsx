'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { PersonaDto, PersonaMapper } from '@app/infrastructure/dtos';

type Props = {
  initialPersona: PersonaDto;
};

export function PersonaView({ initialPersona }: Props) {
  const persona = PersonaMapper.fromDtoToDomain(initialPersona);

  return (
    <>
      <GeneralView persona={persona} />
      <MetadataView persona={persona} />
    </>
  );
}
