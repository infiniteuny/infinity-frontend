import { GetSession, GetTeams } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-team', 'read-own-team'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
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
}
