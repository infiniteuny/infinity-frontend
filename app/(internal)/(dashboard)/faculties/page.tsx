import {
  FacultyDto,
  FacultyMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { FacultiesList, FacultiesToolbar } from '@app/presentation/components/internal/faculties';
import { GetFaculties, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Faculties',
};

export default async function FacultiesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-faculty'].some((p) => userPermissions.has(p))) {
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);

    const result = await getFaculties.execute(undefined, undefined, { perPage: 25 });
    const [faculties, paginationOptions] = match(result, {
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
          { label: 'Faculties', url: '/faculties' },
        ]}
      >
        <SectionHeader title="Faculties" backUrl="/settings">
          <FacultiesToolbar />
        </SectionHeader>
        <FacultiesList
          initialFaculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
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
