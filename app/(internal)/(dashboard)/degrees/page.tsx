import { DegreesList, DegreesToolbar } from '@app/presentation/components/internal/degrees';
import { GetDegrees } from '@app/application';
import {
  DegreeDto,
  DegreeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function DegreesPage() {
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
        initialDegrees={degrees.map(DegreeMapper.fromDomaintoDto) as DegreeDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
