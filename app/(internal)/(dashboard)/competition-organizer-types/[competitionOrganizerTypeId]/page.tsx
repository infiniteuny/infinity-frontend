import { cache } from 'react';
import { GetCompetitionOrganizerType, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import {
  CompetitionOrganizerTypeForm,
  CompetitionOrganizerTypeToolbar,
  CompetitionOrganizerTypeView,
} from '@app/presentation/components/internal/single-competition-organizer-type';

type Props = {
  params: Promise<{
    competitionOrganizerTypeId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionOrganizerTypeId = (await params).competitionOrganizerTypeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    competitionOrganizerTypeId !== 'new' &&
    ['read-competition-organizer-type'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionOrganizerType = serverContainer.get<GetCompetitionOrganizerType>(
      SYMBOLS.GetCompetitionOrganizerType,
    );

    const competitionOrganizerTypeResult = await cache(
      async () => await getCompetitionOrganizerType.execute(competitionOrganizerTypeId),
    )();
    const competitionOrganizerType = match(competitionOrganizerTypeResult, {
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
      title: competitionOrganizerType.name,
    };
  } else if (
    competitionOrganizerTypeId === 'new' &&
    ['create-competition-organizer-type'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Competition Organizer Type',
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionOrganizerTypePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionOrganizerTypeId = (await params).competitionOrganizerTypeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    competitionOrganizerTypeId !== 'new' &&
    ['read-competition-organizer-type'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionOrganizerType = serverContainer.get<GetCompetitionOrganizerType>(
      SYMBOLS.GetCompetitionOrganizerType,
    );
    const competitionOrganizerTypeResult = await cache(
      async () => await getCompetitionOrganizerType.execute(competitionOrganizerTypeId),
    )();
    const competitionOrganizerType = match(competitionOrganizerTypeResult, {
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
          { label: 'Competition Organizer Types', url: '/competition-organizer-types' },
          {
            label: competitionOrganizerType.name,
            url: `/competition-organizer-types/${competitionOrganizerType.id}`,
          },
        ]}
      >
        <SectionHeader title={competitionOrganizerType.name} backUrl="/competition-organizer-types">
          <CompetitionOrganizerTypeToolbar
            competitionOrganizerTypeId={competitionOrganizerType.id}
          />
        </SectionHeader>
        <CompetitionOrganizerTypeView
          initialCompetitionOrganizerType={
            CompetitionOrganizerTypeMapper.fromDomainToDto(
              competitionOrganizerType,
            ) as CompetitionOrganizerTypeDto
          }
        />
      </InternalMain>
    );
  } else if (
    competitionOrganizerTypeId === 'new' &&
    ['create-competition-organizer-type'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competition Organizer Types', url: '/competition-organizer-types' },
          { label: 'Create Competition Organizer Type', url: `/competition-organizer-types/new` },
        ]}
      >
        <CompetitionOrganizerTypeForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
