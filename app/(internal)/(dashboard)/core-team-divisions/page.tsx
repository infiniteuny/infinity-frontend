import {
  CoreTeamDivisionsList,
  CoreTeamDivisionsToolbar,
} from '@app/presentation/components/internal/core-team-divisions';
import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCoreTeamDivisions, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Core Team Divisions',
};

export default async function CoreTeamDivisionsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-core-team-division'].some((p) => userPermissions.has(p))) {
    const getCoreTeamDivisions = serverContainer.get<GetCoreTeamDivisions>(
      SYMBOLS.GetCoreTeamDivisions,
    );

    const result = await getCoreTeamDivisions.execute(undefined, undefined, { perPage: 25 });
    const [coreTeamDivisions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Core Team Divisions', url: '/core-team-divisions' },
        ]}
      >
        <SectionHeader title="Core Team Divisions" backUrl="/settings">
          <CoreTeamDivisionsToolbar />
        </SectionHeader>
        <CoreTeamDivisionsList
          initialCoreTeamDivisions={
            coreTeamDivisions.map(CoreTeamDivisionMapper.fromDomainToDto) as CoreTeamDivisionDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
