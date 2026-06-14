import { CompetitionRanksList } from '@app/presentation/components/internal/competition-ranks';
import {
  CompetitionRankDto,
  CompetitionRankMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionRanks, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competition Ranks',
};

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

    const result = await getCompetitionRanks.execute(undefined, undefined, { perPage: 25 });
    const [competitionRanks, paginationOptions] = match(result, {
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
          { label: 'Competition Ranks', url: '/competition-ranks' },
        ]}
      >
        <CompetitionRanksList
          initialCompetitionRanks={
            competitionRanks.map(CompetitionRankMapper.fromDomainToDto) as CompetitionRankDto[]
          }
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
