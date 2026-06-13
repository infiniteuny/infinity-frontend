import { cache } from 'react';
import {
  CompetitionDto,
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionMapper,
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { CompetitionInstanceForm } from '@app/presentation/components/internal/single-competition-instance';
import {
  GetCompetition,
  GetCompetitionInstance,
  GetCompetitionOrganizerTypes,
  GetSession,
} from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { isLeft, match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    competitionId: string;
    instanceId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const { competitionId, instanceId } = await params;

  const [competitionResult, sessionResult] = await Promise.all([
    cache(async () => await getCompetition.execute(competitionId))(),
    cache(async () => await getSession.execute())(),
  ]);

  if (isLeft(competitionResult)) {
    const error = competitionResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

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
        await getCompetitionInstance.execute(instanceId, ['competition', 'organizer_type']),
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

export default async function SingleCompetitionInstanceEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const { competitionId, instanceId } = await params;

  const [competitionResult, sessionResult] = await Promise.all([
    cache(async () => await getCompetition.execute(competitionId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const competition = match(competitionResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
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
          await getCompetitionInstance.execute(instanceId, ['competition', 'organizer_type']),
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
          { label: 'Settings', url: '/settings' },
          { label: 'Competitions', url: '/competitions' },
          {
            label: competition.shortname || competition.name,
            url: `/competitions/${competition.id}`,
          },
          { label: 'Instances', url: `/competitions/${competitionId}/instances` },
          {
            label: competitionInstance.shortname || competitionInstance.name,
            url: `/competitions/${competitionId}/instances/${competitionInstance.id}`,
          },
          {
            label: 'Edit',
            url: `/competitions/${competitionId}/instances/${competitionInstance.id}/edit`,
          },
        ]}
      >
        <CompetitionInstanceForm
          competition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
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
