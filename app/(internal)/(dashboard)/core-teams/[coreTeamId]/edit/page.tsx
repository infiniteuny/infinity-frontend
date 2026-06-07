import { cache } from 'react';
import { GetCoreTeam, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import { CoreTeamForm } from '@app/presentation/components/internal/single-core-team';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

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

  if (['update-core-team'].some((p) => userPermissions.has(p))) {
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
      title: `Edit ${coreTeam.year}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team'].some((p) => userPermissions.has(p))) {
    const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
    const coreTeamId = (await params).coreTeamId;

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
          { label: 'Edit', url: `/core-teams/${coreTeam.id}/edit` },
        ]}
      >
        <CoreTeamForm initialCoreTeam={CoreTeamMapper.fromDomainToDto(coreTeam) as CoreTeamDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
