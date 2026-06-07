import { cache } from 'react';
import { GetCompetitionTeamType, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';
import { CompetitionTeamTypeForm } from '@app/presentation/components/internal/single-competition-team-type';

type Props = {
  params: Promise<{
    teamTypeId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const teamTypeId = (await params).teamTypeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-team-type'].some((p) => userPermissions.has(p))) {
    const getCompetitionTeamType = serverContainer.get<GetCompetitionTeamType>(
      SYMBOLS.GetCompetitionTeamType,
    );

    const competitionTeamTypeResult = await cache(
      async () => await getCompetitionTeamType.execute(teamTypeId),
    )();
    const competitionTeamType = match(competitionTeamTypeResult, {
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
      title: `Edit ${competitionTeamType.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionTeamTypeEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-team-type'].some((p) => userPermissions.has(p))) {
    const getCompetitionTeamType = serverContainer.get<GetCompetitionTeamType>(
      SYMBOLS.GetCompetitionTeamType,
    );
    const teamTypeId = (await params).teamTypeId;

    const competitionTeamTypeResult = await cache(
      async () => await getCompetitionTeamType.execute(teamTypeId),
    )();
    const competitionTeamType = match(competitionTeamTypeResult, {
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
          { label: 'Team Types', url: '/team-types' },
          { label: competitionTeamType.name, url: `/team-types/${competitionTeamType.id}` },
          { label: 'Edit', url: `/team-types/${competitionTeamType.id}/edit` },
        ]}
      >
        <CompetitionTeamTypeForm
          initialCompetitionTeamType={
            CompetitionTeamTypeMapper.fromDomainToDto(competitionTeamType) as CompetitionTeamTypeDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
