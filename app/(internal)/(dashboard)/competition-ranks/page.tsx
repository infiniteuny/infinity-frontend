import {
  CompetitionRanksList,
  CompetitionRanksToolbar,
} from '@app/presentation/components/internal/competition-ranks';
import {
  CompetitionRankDto,
  CompetitionRankMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionRanks, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function CompetitionRanksPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-competition-rank'].some((p) => userPermissions.has(p))) {
    const getCompetitionRanks = serverContainer.get<GetCompetitionRanks>(
      SYMBOLS.GetCompetitionRanks,
    );

    const result = await getCompetitionRanks.execute(undefined, { perPage: 25 });
    const [competitionRanks, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Competition Ranks">
          <CompetitionRanksToolbar />
        </SectionHeader>
        <CompetitionRanksList
          initialCompetitionRanks={
            competitionRanks.map(CompetitionRankMapper.fromDomainToDto) as CompetitionRankDto[]
          }
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
