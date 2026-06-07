import { cache } from 'react';
import { GetCompetitionRank, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionRankDto, CompetitionRankMapper } from '@app/infrastructure/dtos';
import { CompetitionRankForm } from '@app/presentation/components/internal/single-competition-rank';

type Props = {
  params: Promise<{
    competitionRankId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionRankId = (await params).competitionRankId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-rank'].some((p) => userPermissions.has(p))) {
    const getCompetitionRank = serverContainer.get<GetCompetitionRank>(SYMBOLS.GetCompetitionRank);

    const competitionRankResult = await cache(
      async () => await getCompetitionRank.execute(competitionRankId),
    )();
    const competitionRank = match(competitionRankResult, {
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
      title: `Edit ${competitionRank.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionRankEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-rank'].some((p) => userPermissions.has(p))) {
    const getCompetitionRank = serverContainer.get<GetCompetitionRank>(SYMBOLS.GetCompetitionRank);
    const competitionRankId = (await params).competitionRankId;

    const competitionRankResult = await cache(
      async () => await getCompetitionRank.execute(competitionRankId),
    )();
    const competitionRank = match(competitionRankResult, {
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
          { label: 'Competition Ranks', url: '/competition-ranks' },
          { label: competitionRank.name, url: `/competition-ranks/${competitionRank.id}` },
          { label: 'Edit', url: `/competition-ranks/${competitionRank.id}/edit` },
        ]}
      >
        <CompetitionRankForm
          initialCompetitionRank={
            CompetitionRankMapper.fromDomainToDto(competitionRank) as CompetitionRankDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
