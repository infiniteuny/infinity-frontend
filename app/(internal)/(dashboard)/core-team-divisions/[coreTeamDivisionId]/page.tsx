import { cache } from 'react';
import { GetCoreTeamDivision, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import {
  CoreTeamDivisionForm,
  CoreTeamDivisionToolbar,
  CoreTeamDivisionView,
} from '@app/presentation/components/internal/single-core-team-division';

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

  if (
    coreTeamDivisionId !== 'new' &&
    ['read-core-team-division'].some((p) => userPermissions.has(p))
  ) {
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
      title: coreTeamDivision.name,
    };
  } else if (
    coreTeamDivisionId === 'new' &&
    ['create-core-team-division'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Core Team Division',
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamDivisionPage({ params }: Props) {
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

  if (
    coreTeamDivisionId !== 'new' &&
    ['read-core-team-division'].some((p) => userPermissions.has(p))
  ) {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Core Team Divisions', url: '/core-team-divisions' },
          { label: coreTeamDivision.name, url: `/core-team-divisions/${coreTeamDivision.id}` },
        ]}
      >
        <SectionHeader title={coreTeamDivision.name} backUrl="/core-team-divisions">
          <CoreTeamDivisionToolbar coreTeamDivisionId={coreTeamDivision.id} />
        </SectionHeader>
        <CoreTeamDivisionView
          initialCoreTeamDivision={
            CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision) as CoreTeamDivisionDto
          }
        />
      </InternalMain>
    );
  } else if (
    coreTeamDivisionId === 'new' &&
    ['create-core-team-division'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Core Team Divisions', url: '/core-team-divisions' },
          { label: 'Create Core Team Division', url: `/core-team-divisions/new` },
        ]}
      >
        <CoreTeamDivisionForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
