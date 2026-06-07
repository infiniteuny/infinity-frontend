import { cache } from 'react';
import { GetCompetitionScale, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionScaleDto, CompetitionScaleMapper } from '@app/infrastructure/dtos';
import { CompetitionScaleForm } from '@app/presentation/components/internal/single-competition-scale';

type Props = {
  params: Promise<{
    competitionScaleId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionScaleId = (await params).competitionScaleId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-scale'].some((p) => userPermissions.has(p))) {
    const getCompetitionScale = serverContainer.get<GetCompetitionScale>(
      SYMBOLS.GetCompetitionScale,
    );

    const competitionScaleResult = await cache(
      async () => await getCompetitionScale.execute(competitionScaleId),
    )();
    const competitionScale = match(competitionScaleResult, {
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
      title: `Edit ${competitionScale.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionScaleEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-scale'].some((p) => userPermissions.has(p))) {
    const getCompetitionScale = serverContainer.get<GetCompetitionScale>(
      SYMBOLS.GetCompetitionScale,
    );
    const competitionScaleId = (await params).competitionScaleId;

    const competitionScaleResult = await cache(
      async () => await getCompetitionScale.execute(competitionScaleId),
    )();
    const competitionScale = match(competitionScaleResult, {
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
          { label: 'Competition Scales', url: '/competition-scales' },
          { label: competitionScale.name, url: `/competition-scales/${competitionScale.id}` },
          { label: 'Edit', url: `/competition-scales/${competitionScale.id}/edit` },
        ]}
      >
        <CompetitionScaleForm
          initialCompetitionScale={
            CompetitionScaleMapper.fromDomainToDto(competitionScale) as CompetitionScaleDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
