import { cache } from 'react';
import {
  GetCompetition,
  GetCompetitionInstance,
  GetCompetitionOrganizerTypes,
  GetSession,
} from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  CompetitionDto,
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionMapper,
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionInstanceForm,
  CompetitionInstanceToolbar,
  CompetitionInstanceView,
} from '@app/presentation/components/internal/single-competition-instance';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    competitionId: string;
    instanceId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const { competitionId, instanceId } = await params;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (instanceId !== 'new') {
    const getCompetitionInstance = serverContainer.get<GetCompetitionInstance>(
      SYMBOLS.GetCompetitionInstance,
    );

    const competitionInstanceResult = await cache(
      async () =>
        await getCompetitionInstance.execute(instanceId, ['competition', 'organizer_type']),
    )();
    const competitionInstance = match(competitionInstanceResult, {
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
      title: competitionInstance.shortname || competitionInstance.name,
    };
  } else if (instanceId === 'new' && ['create-competition'].some((p) => userPermissions.has(p))) {
    const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);

    const competitionResult = await cache(
      async () => await getCompetition.execute(competitionId),
    )();
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

    return {
      title: `Add ${competition.shortname || competition.name}'s Instance`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionInstancePage({ params }: Props) {
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

  if (instanceId !== 'new') {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competitions', url: '/competitions' },
          {
            label: competition.shortname || competition.name,
            url: `/competitions/${competitionId}`,
          },
          { label: 'Instances', url: `/competitions/${competitionId}/instances` },
          {
            label: competitionInstance.shortname || competitionInstance.name,
            url: `/competitions/${competitionId}/instances/${competitionInstance.id}`,
          },
        ]}
      >
        <SectionHeader
          title={competitionInstance.shortname || competitionInstance.name}
          backUrl={`/competitions/${competitionId}/instances`}
        >
          <CompetitionInstanceToolbar
            competitionInstanceId={competitionInstance.id}
            competitionId={competitionInstance.competitionId}
          />
        </SectionHeader>
        <CompetitionInstanceView
          initialCompetitionInstance={
            CompetitionInstanceMapper.fromDomainToDto(competitionInstance) as CompetitionInstanceDto
          }
        />
      </InternalMain>
    );
  } else if (instanceId === 'new' && ['create-competition'].some((p) => userPermissions.has(p))) {
    const getCompetitionOrganizerTypes = serverContainer.get<GetCompetitionOrganizerTypes>(
      SYMBOLS.GetCompetitionOrganizerTypes,
    );

    const organizerTypesResult = await getCompetitionOrganizerTypes.execute(undefined, undefined, {
      perPage: 100,
    });
    const [competitionOrganizerTypes] = match(organizerTypesResult, {
      onLeft: (error) => {
        throw error;
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
            url: `/competitions/${competitionId}`,
          },
          { label: 'Instances', url: `/competitions/${competitionId}/instances` },
          { label: 'Add', url: `/competitions/${competitionId}/instances/new` },
        ]}
      >
        <CompetitionInstanceForm
          competition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
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
