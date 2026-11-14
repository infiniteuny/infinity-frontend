import { cache } from 'react';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@infiniteuny/infinity-infrastructure';
import { CompetitionInstanceForm } from '@app/presentation/components/internal/single-competition-instance';
import {
  GetCompetitionInstance,
  GetCompetitionOrganizerTypes,
  GetSession,
} from '@infiniteuny/infinity-application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@infiniteuny/infinity-domain';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionId = (await params).competitionId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition'].some((p) => userPermissions.has(p))) {
    const getCompetitionInstance = serverContainer.get<GetCompetitionInstance>(
      SYMBOLS.GetCompetitionInstance,
    );

    const instanceResult = await cache(
      async () =>
        await getCompetitionInstance.execute(competitionId, ['competition', 'organizer_type']),
    )();
    const competitionInstance = match(instanceResult, {
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
      title: `Edit ${competitionInstance.shortname || competitionInstance.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionId = (await params).competitionId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition'].some((p) => userPermissions.has(p))) {
    const getCompetitionOrganizerTypes = serverContainer.get<GetCompetitionOrganizerTypes>(
      SYMBOLS.GetCompetitionOrganizerTypes,
    );
    const getCompetitionInstance = serverContainer.get<GetCompetitionInstance>(
      SYMBOLS.GetCompetitionInstance,
    );

    const [instanceResult, organizerTypesResult] = await Promise.all([
      cache(
        async () =>
          await getCompetitionInstance.execute(competitionId, ['competition', 'organizer_type']),
      )(),
      getCompetitionOrganizerTypes.execute(undefined, undefined, { perPage: 100 }),
    ]);

    const [competitionOrganizerTypes] = match(organizerTypesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });
    const competitionInstance = match(instanceResult, {
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
          { label: 'Competitions', url: '/competitions' },
          {
            label: competitionInstance.shortname || competitionInstance.name,
            url: `/competitions/${competitionInstance.id}`,
          },
          {
            label: 'Edit',
            url: `/competitions/${competitionInstance.id}/edit`,
          },
        ]}
      >
        <CompetitionInstanceForm
          initialCompetitionInstance={
            CompetitionInstanceMapper.fromDomainToDto(competitionInstance) as CompetitionInstanceDto
          }
          competitionOrganizerTypes={
            competitionOrganizerTypes.map(
              CompetitionOrganizerTypeMapper.fromDomainToDto,
            ) as CompetitionOrganizerTypeDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
