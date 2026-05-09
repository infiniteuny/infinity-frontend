import {
  FacultyDto,
  FacultyMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { FacultiesList, FacultiesToolbar } from '@app/presentation/components/internal/faculties';
import { GetFaculties, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

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

    const result = await getFaculties.execute(undefined, { perPage: 25 });
    const [faculties, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Faculties">
          <FacultiesToolbar />
        </SectionHeader>
        <FacultiesList
          initialFaculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
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
