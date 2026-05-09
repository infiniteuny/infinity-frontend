import {
  DegreeDto,
  DegreeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { DegreesList, DegreesToolbar } from '@app/presentation/components/internal/degrees';
import { GetDegrees, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function DegreesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-degree'].some((p) => userPermissions.has(p))) {
    const getDegrees = serverContainer.get<GetDegrees>(SYMBOLS.GetDegrees);

    const result = await getDegrees.execute(undefined, { perPage: 25 });
    const [degrees, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Degrees">
          <DegreesToolbar />
        </SectionHeader>
        <DegreesList
          initialDegrees={degrees.map(DegreeMapper.fromDomainToDto) as DegreeDto[]}
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
