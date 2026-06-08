import { cache } from 'react';
import { GetCompetition, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@app/infrastructure/dtos';
import {
  CompetitionForm,
  CompetitionToolbar,
  CompetitionView,
} from '@app/presentation/components/internal/single-competition';

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
      title: competition.shortname || competition.name,
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
        ]}
      >
        <SectionHeader title={competition.shortname || competition.name} backUrl="/competitions">
          <CompetitionToolbar competitionId={competition.id} />
        </SectionHeader>
        <CompetitionView
          initialCompetition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
        />
      </InternalMain>
    );
  } else if (
    competitionId === 'new' &&
    ['create-competition'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competitions', url: '/competitions' },
          { label: 'Create Competition', url: `/competitions/new` },
        ]}
      >
        <CompetitionForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
