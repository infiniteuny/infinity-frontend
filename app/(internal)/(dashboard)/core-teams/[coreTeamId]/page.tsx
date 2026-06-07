import { cache } from 'react';
import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import {
  CoreTeamForm,
  CoreTeamToolbar,
  CoreTeamView,
} from '@app/presentation/components/internal/single-core-team';
import { GetCoreTeam, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const coreTeamId = (await params).coreTeamId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (coreTeamId !== 'new') {
    const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
    const coreTeamResult = await cache(async () => await getCoreTeam.execute(coreTeamId))();

    const coreTeam = match(coreTeamResult, {
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
      title: coreTeam.year.toString(),
    };
  } else if (coreTeamId === 'new' && ['create-core-team'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Core Team',
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const coreTeamId = (await params).coreTeamId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (coreTeamId !== 'new') {
    const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);

    const coreTeamResult = await cache(async () => await getCoreTeam.execute(coreTeamId))();
    const coreTeam = match(coreTeamResult, {
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
          { label: 'Core Teams', url: '/core-teams' },
          { label: coreTeam.year.toString(), url: `/core-teams/${coreTeam.id}` },
        ]}
      >
        <SectionHeader title={coreTeam.year.toString()} backUrl="/core-teams">
          <CoreTeamToolbar coreTeamId={coreTeam.id} />
        </SectionHeader>
        <CoreTeamView initialCoreTeam={CoreTeamMapper.fromDomainToDto(coreTeam) as CoreTeamDto} />
      </InternalMain>
    );
  } else if (coreTeamId === 'new' && ['create-core-team'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Core Teams', url: '/core-teams' },
          { label: 'Create Core Team', url: `/core-teams/new` },
        ]}
      >
        <CoreTeamForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
