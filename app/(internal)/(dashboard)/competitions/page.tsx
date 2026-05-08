import {
  CompetitionDto,
  CompetitionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CompetitionsList,
  CompetitionsToolbar,
} from '@app/presentation/components/internal/competitions';
import { GetCompetitions, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function CompetitionsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-competition'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCompetitions = serverContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions);

    const result = await getCompetitions.execute(undefined, { perPage: 25 });
    const [competitions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Competitions">
          <CompetitionsToolbar />
        </SectionHeader>
        <CompetitionsList
          initialCompetitions={
            competitions.map(CompetitionMapper.fromDomainToDto) as CompetitionDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
