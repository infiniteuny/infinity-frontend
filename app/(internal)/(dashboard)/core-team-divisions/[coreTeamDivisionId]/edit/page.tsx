import { cache } from 'react';
import { GetCoreTeamDivision, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import { CoreTeamDivisionForm } from '@app/presentation/components/internal/single-core-team-division';

type Props = {
  params: Promise<{
    coreTeamDivisionId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const coreTeamDivisionId = (await params).coreTeamDivisionId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team-division'].some((p) => userPermissions.has(p))) {
    const getCoreTeamDivision = serverContainer.get<GetCoreTeamDivision>(
      SYMBOLS.GetCoreTeamDivision,
    );

    const coreTeamDivisionResult = await cache(
      async () => await getCoreTeamDivision.execute(coreTeamDivisionId),
    )();
    const coreTeamDivision = match(coreTeamDivisionResult, {
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
      title: `Edit ${coreTeamDivision.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamDivisionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team-division'].some((p) => userPermissions.has(p))) {
    const getCoreTeamDivision = serverContainer.get<GetCoreTeamDivision>(
      SYMBOLS.GetCoreTeamDivision,
    );
    const coreTeamDivisionId = (await params).coreTeamDivisionId;

    const coreTeamDivisionResult = await cache(
      async () => await getCoreTeamDivision.execute(coreTeamDivisionId),
    )();
    const coreTeamDivision = match(coreTeamDivisionResult, {
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
          { label: 'Core Team Divisions', url: '/core-team-divisions' },
          { label: coreTeamDivision.name, url: `/core-team-divisions/${coreTeamDivision.id}` },
          { label: 'Edit', url: `/core-team-divisions/${coreTeamDivision.id}/edit` },
        ]}
      >
        <CoreTeamDivisionForm
          initialCoreTeamDivision={
            CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision) as CoreTeamDivisionDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
