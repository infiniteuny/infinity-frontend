import { GetTeams } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TeamDto,
  TeamMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { TeamsList, TeamsToolbar } from '@app/presentation/components/internal/teams';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const getTeams = serverContainer.get<GetTeams>(SYMBOLS.GetTeams);
  const result = await getTeams.execute(['leader', 'team_type'], undefined, { perPage: 25 });
  const [teams, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Teams">
        <TeamsToolbar />
      </SectionHeader>
      <TeamsList
        initialTeams={teams.map(TeamMapper.fromDomainToDto) as TeamDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
