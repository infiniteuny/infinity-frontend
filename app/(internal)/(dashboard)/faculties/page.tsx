import { FacultiesList, FacultiesToolbar } from '@app/presentation/components/internal/faculties';
import { GetFaculties } from '@app/application';
import {
  FacultyDto,
  FacultyMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function FacultiesPage() {
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
        initialFaculties={faculties.map(FacultyMapper.fromDomaintoDto) as FacultyDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
