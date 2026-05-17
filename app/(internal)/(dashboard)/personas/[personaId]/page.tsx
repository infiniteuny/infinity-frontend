import { GetPersona, GetSession } from '@app/application';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const personaId = (await params).personaId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

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
        <PersonaView initialPersona={PersonaMapper.fromDomainToDto(persona) as PersonaDto} />
      </>
    );
  } else if (personaId === 'new' && ['create-persona'].some((p) => userPermissions.has(p))) {
    return <PersonaForm />;
  } else {
    notFound();
  }
}
