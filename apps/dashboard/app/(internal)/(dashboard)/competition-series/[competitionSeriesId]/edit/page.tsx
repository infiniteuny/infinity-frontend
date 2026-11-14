import { cache } from 'react';
import { GetCompetition, GetSession } from '@infiniteuny/infinity-application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@infiniteuny/infinity-domain';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@infiniteuny/infinity-infrastructure';
import { CompetitionForm } from '@app/presentation/components/internal/single-competition';

type Props = {
  params: Promise<{
    competitionSeriesId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionSeriesId = (await params).competitionSeriesId;

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
      async () => await getCompetition.execute(competitionSeriesId),
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
      title: `Edit ${competition.shortname || competition.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionSeriesEditPage({ params }: Props) {
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
    const competitionSeriesId = (await params).competitionSeriesId;

    const competitionResult = await cache(
      async () => await getCompetition.execute(competitionSeriesId),
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
          { label: 'Competition Series', url: '/competition-series' },
          {
            label: competition.shortname || competition.name,
            url: `/competition-series/${competition.id}`,
          },
          { label: 'Edit', url: `/competition-series/${competition.id}/edit` },
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
