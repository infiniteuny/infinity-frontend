import { cache } from 'react';
import {
  GetCompetitionInstance,
  GetCompetitionOrganizerTypes,
  GetSession,
} from '@infiniteuny/infinity-application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@infiniteuny/infinity-infrastructure';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionInstanceForm,
  CompetitionInstanceToolbar,
  CompetitionInstanceView,
} from '@app/presentation/components/internal/single-competition-instance';
import { NotFoundError } from '@infiniteuny/infinity-domain';
import { notFound } from 'next/navigation';

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

  if (competitionId !== 'new') {
    const getCompetitionInstance = serverContainer.get<GetCompetitionInstance>(
      SYMBOLS.GetCompetitionInstance,
    );

    const competitionInstanceResult = await cache(
      async () =>
        await getCompetitionInstance.execute(competitionId, ['competition', 'organizer_type']),
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
  } else if (
    competitionId === 'new' &&
    ['create-competition'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Competition',
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionPage({ params }: Props) {
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

  if (competitionId !== 'new') {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Competitions', url: '/competitions' },
          {
            label: competitionInstance.shortname || competitionInstance.name,
            url: `/competitions/${competitionInstance.id}`,
          },
        ]}
      >
        <SectionHeader
          title={competitionInstance.shortname || competitionInstance.name}
          backUrl="/competitions"
        >
          <CompetitionInstanceToolbar competitionInstanceId={competitionInstance.id} />
        </SectionHeader>
        <CompetitionInstanceView
          initialCompetitionInstance={
            CompetitionInstanceMapper.fromDomainToDto(competitionInstance) as CompetitionInstanceDto
          }
        />
      </InternalMain>
    );
  } else if (
    competitionId === 'new' &&
    ['create-competition'].some((p) => userPermissions.has(p))
  ) {
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
          { label: 'Competitions', url: '/competitions' },
          { label: 'Create Competition', url: '/competitions/new' },
        ]}
      >
        <CompetitionInstanceForm
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
