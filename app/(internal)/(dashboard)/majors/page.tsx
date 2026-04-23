import { MajorsList, MajorsToolbar } from '@app/presentation/components/internal/majors';
import { GetMajors } from '@app/application';
import {
  MajorDto,
  MajorMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function MajorsPage() {
  const getMajors = serverContainer.get<GetMajors>(SYMBOLS.GetMajors);
  const result = await getMajors.execute(['degree', 'faculty'], undefined, { perPage: 25 });
  const [majors, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Majors">
        <MajorsToolbar />
      </SectionHeader>
      <MajorsList
        initialMajors={majors.map(MajorMapper.fromDomaintoDto) as MajorDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
