import { cache } from 'react';
import { GetCompetitionOutput, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';
import { CompetitionOutputForm } from '@app/presentation/components/internal/single-competition-output';

type Props = {
  params: Promise<{
    competitionOutputId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionOutputId = (await params).competitionOutputId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-output'].some((p) => userPermissions.has(p))) {
    const getCompetitionOutput = serverContainer.get<GetCompetitionOutput>(
      SYMBOLS.GetCompetitionOutput,
    );

    const competitionOutputResult = await cache(
      async () => await getCompetitionOutput.execute(competitionOutputId),
    )();
    const competitionOutput = match(competitionOutputResult, {
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
      title: `Edit ${competitionOutput.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionOutputEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-output'].some((p) => userPermissions.has(p))) {
    const getCompetitionOutput = serverContainer.get<GetCompetitionOutput>(
      SYMBOLS.GetCompetitionOutput,
    );
    const competitionOutputId = (await params).competitionOutputId;

    const competitionOutputResult = await cache(
      async () => await getCompetitionOutput.execute(competitionOutputId),
    )();
    const competitionOutput = match(competitionOutputResult, {
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
          { label: 'Competition Outputs', url: '/competition-outputs' },
          { label: competitionOutput.name, url: `/competition-outputs/${competitionOutput.id}` },
          { label: 'Edit', url: `/competition-outputs/${competitionOutput.id}/edit` },
        ]}
      >
        <CompetitionOutputForm
          initialCompetitionOutput={
            CompetitionOutputMapper.fromDomainToDto(competitionOutput) as CompetitionOutputDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
