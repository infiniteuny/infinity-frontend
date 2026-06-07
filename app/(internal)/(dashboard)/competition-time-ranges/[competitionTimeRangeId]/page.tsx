import { cache } from 'react';
import { GetCompetitionTimeRange, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import {
  CompetitionTimeRangeForm,
  CompetitionTimeRangeToolbar,
  CompetitionTimeRangeView,
} from '@app/presentation/components/internal/single-competition-time-range';

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

  if (
    competitionTimeRangeId !== 'new' &&
    ['read-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
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
      title: competitionTimeRange.name,
    };
  } else if (
    competitionTimeRangeId === 'new' &&
    ['create-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Competition Time Range',
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionTimeRangePage({ params }: Props) {
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

  if (
    competitionTimeRangeId !== 'new' &&
    ['read-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
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
        ]}
      >
        <SectionHeader title={competitionTimeRange.name} backUrl="/competition-time-ranges">
          <CompetitionTimeRangeToolbar competitionTimeRangeId={competitionTimeRange.id} />
        </SectionHeader>
        <CompetitionTimeRangeView
          initialCompetitionTimeRange={
            CompetitionTimeRangeMapper.fromDomainToDto(
              competitionTimeRange,
            ) as CompetitionTimeRangeDto
          }
        />
      </InternalMain>
    );
  } else if (
    competitionTimeRangeId === 'new' &&
    ['create-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competition Time Ranges', url: '/competition-time-ranges' },
          { label: 'Create Competition Time Range', url: `/competition-time-ranges/new` },
        ]}
      >
        <CompetitionTimeRangeForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
