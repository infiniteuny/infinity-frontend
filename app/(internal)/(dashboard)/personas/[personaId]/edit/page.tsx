import { GetPersona } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { PersonaDto, PersonaMapper } from '@app/infrastructure/dtos';
import { PersonaForm } from '@app/presentation/components/internal/single-persona';

type Props = {
  params: Promise<{
    personaId: string;
  }>;
};

export default async function SinglePersonaEditPage({ params }: Props) {
  const getPersona = serverContainer.get<GetPersona>(SYMBOLS.GetPersona);
  const personaId = (await params).personaId;

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

  return <PersonaForm initialPersona={PersonaMapper.fromDomaintoDto(persona) as PersonaDto} />;
}
