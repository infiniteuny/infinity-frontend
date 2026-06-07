import { cache } from 'react';
import { GetCompetition, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@app/infrastructure/dtos';
import { CompetitionForm } from '@app/presentation/components/internal/single-competition';

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
      title: `Edit ${competition.name}`,
    };
  } else {
    return {
      title: 'Create Competition',
    };
  }
}

export default async function SingleCompetitionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition'].some((p) => userPermissions.has(p))) {
    const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
    const competitionId = (await params).competitionId;

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
          { label: competition.name, url: `/competitions/${competition.id}` },
          { label: 'Edit', url: `/competitions/${competition.id}/edit` },
        ]}
      >
        <CompetitionForm
          initialCompetition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
