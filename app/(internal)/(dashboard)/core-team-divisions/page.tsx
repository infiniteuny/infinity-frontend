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
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

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

    const result = await getCoreTeamDivisions.execute(undefined, { perPage: 25 });
    const [coreTeamDivisions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Core Team Divisions">
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
      </>
    );
  } else {
    notFound();
  }
}
