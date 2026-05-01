import {
  CoreTeamDivisionsList,
  CoreTeamDivisionsToolbar,
} from '@app/presentation/components/internal/core-team-divisions';
import { GetCoreTeamDivisions } from '@app/application';
import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CoreTeamDivisionsPage() {
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
}
