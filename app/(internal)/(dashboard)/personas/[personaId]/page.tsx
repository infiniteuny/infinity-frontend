import { GetPersona } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { PersonaDto, PersonaMapper } from '@app/infrastructure/dtos';
import {
  PersonaForm,
  PersonaToolbar,
  PersonaView,
} from '@app/presentation/components/internal/single-persona';

type Props = {
  params: Promise<{
    personaId: string;
  }>;
};

export default async function SinglePersonaPage({ params }: Props) {
  const personaId = (await params).personaId;

  if (personaId !== 'new') {
    const getPersona = serverContainer.get<GetPersona>(SYMBOLS.GetPersona);
    const personaResult = await getPersona.execute(personaId);
    const persona = match(personaResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={persona.name}>
          <PersonaToolbar personaId={persona.id} />
        </SectionHeader>
        <PersonaView initialPersona={PersonaMapper.fromDomaintoDto(persona) as PersonaDto} />
      </>
    );
  } else {
    return <PersonaForm />;
  }
}
