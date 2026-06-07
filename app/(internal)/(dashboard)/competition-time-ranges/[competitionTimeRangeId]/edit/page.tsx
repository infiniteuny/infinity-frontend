import { cache } from 'react';
import { GetCompetitionTimeRange, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import { CompetitionTimeRangeForm } from '@app/presentation/components/internal/single-competition-time-range';

type Props = {
  params: Promise<{
    competitionTimeRangeId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionTimeRangeId = (await params).competitionTimeRangeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-time-range'].some((p) => userPermissions.has(p))) {
    const getCompetitionTimeRange = serverContainer.get<GetCompetitionTimeRange>(
      SYMBOLS.GetCompetitionTimeRange,
    );

    const competitionTimeRangeResult = await cache(
      async () => await getCompetitionTimeRange.execute(competitionTimeRangeId),
    )();
    const competitionTimeRange = match(competitionTimeRangeResult, {
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
      title: `Edit ${competitionTimeRange.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionTimeRangeEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-time-range'].some((p) => userPermissions.has(p))) {
    const getCompetitionTimeRange = serverContainer.get<GetCompetitionTimeRange>(
      SYMBOLS.GetCompetitionTimeRange,
    );
    const competitionTimeRangeId = (await params).competitionTimeRangeId;

    const competitionTimeRangeResult = await cache(
      async () => await getCompetitionTimeRange.execute(competitionTimeRangeId),
    )();
    const competitionTimeRange = match(competitionTimeRangeResult, {
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
          { label: 'Competition Time Ranges', url: '/competition-time-ranges' },
          {
            label: competitionTimeRange.name,
            url: `/competition-time-ranges/${competitionTimeRange.id}`,
          },
          { label: 'Edit', url: `/competition-time-ranges/${competitionTimeRange.id}/edit` },
        ]}
      >
        <CompetitionTimeRangeForm
          initialCompetitionTimeRange={
            CompetitionTimeRangeMapper.fromDomainToDto(
              competitionTimeRange,
            ) as CompetitionTimeRangeDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
