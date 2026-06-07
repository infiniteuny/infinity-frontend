import { cache } from 'react';
import { GetCompetitionOutput, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';
import {
  CompetitionOutputForm,
  CompetitionOutputToolbar,
  CompetitionOutputView,
} from '@app/presentation/components/internal/single-competition-output';

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

  if (
    competitionOutputId !== 'new' &&
    ['read-competition-output'].some((p) => userPermissions.has(p))
  ) {
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
      title: competitionOutput.name,
    };
  } else if (
    competitionOutputId === 'new' &&
    ['create-competition-output'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Competition Output',
    };
  } else {
    notFound();
  }
}

export default async function SingleCompetitionOutputPage({ params }: Props) {
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

  if (
    competitionOutputId !== 'new' &&
    ['read-competition-output'].some((p) => userPermissions.has(p))
  ) {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competition Outputs', url: '/competition-outputs' },
          { label: competitionOutput.name, url: `/competition-outputs/${competitionOutput.id}` },
        ]}
      >
        <SectionHeader title={competitionOutput.name} backUrl="/competition-outputs">
          <CompetitionOutputToolbar competitionOutputId={competitionOutput.id} />
        </SectionHeader>
        <CompetitionOutputView
          initialCompetitionOutput={
            CompetitionOutputMapper.fromDomainToDto(competitionOutput) as CompetitionOutputDto
          }
        />
      </InternalMain>
    );
  } else if (
    competitionOutputId === 'new' &&
    ['create-competition-output'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competition Outputs', url: '/competition-outputs' },
          { label: 'Create Competition Output', url: `/competition-outputs/new` },
        ]}
      >
        <CompetitionOutputForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
