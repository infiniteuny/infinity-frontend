import { cache } from 'react';
import { GetPersona, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { PersonaDto, PersonaMapper } from '@app/infrastructure/dtos';
import { PersonaForm } from '@app/presentation/components/internal/single-persona';

type Props = {
  params: Promise<{
    personaId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const personaId = (await params).personaId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-persona'].some((p) => userPermissions.has(p))) {
    const getPersona = serverContainer.get<GetPersona>(SYMBOLS.GetPersona);

    const personaResult = await cache(async () => await getPersona.execute(personaId))();
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

    return {
      title: `Edit ${persona.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SinglePersonaEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-persona'].some((p) => userPermissions.has(p))) {
    const getPersona = serverContainer.get<GetPersona>(SYMBOLS.GetPersona);
    const personaId = (await params).personaId;

    const personaResult = await cache(async () => await getPersona.execute(personaId))();
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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Personas', url: '/personas' },
          { label: persona.name, url: `/personas/${persona.id}` },
          { label: 'Edit', url: `/personas/${persona.id}/edit` },
        ]}
      >
        <PersonaForm initialPersona={PersonaMapper.fromDomainToDto(persona) as PersonaDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
