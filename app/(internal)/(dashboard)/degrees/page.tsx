import {
  DegreeDto,
  DegreeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { DegreesList, DegreesToolbar } from '@app/presentation/components/internal/degrees';
import { GetDegrees, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Degrees',
};

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

    const result = await getDegrees.execute(undefined, undefined, { perPage: 25 });
    const [degrees, paginationOptions] = match(result, {
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
          { label: 'Degrees', url: '/degrees' },
        ]}
      >
        <SectionHeader title="Degrees" backUrl="/settings">
          <DegreesToolbar />
        </SectionHeader>
        <DegreesList
          initialDegrees={degrees.map(DegreeMapper.fromDomainToDto) as DegreeDto[]}
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
