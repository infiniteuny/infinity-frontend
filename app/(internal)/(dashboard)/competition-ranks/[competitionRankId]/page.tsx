import { GetCompetitionRank, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionRankDto, CompetitionRankMapper } from '@app/infrastructure/dtos';
import {
  CompetitionRankForm,
  CompetitionRankToolbar,
  CompetitionRankView,
} from '@app/presentation/components/internal/single-competition-rank';

type Props = {
  params: Promise<{
    competitionRankId: string;
  }>;
};

export default async function SingleCompetitionRankPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionRankId = (await params).competitionRankId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    competitionRankId !== 'new' &&
    ['read-competition-rank'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionRank = serverContainer.get<GetCompetitionRank>(SYMBOLS.GetCompetitionRank);
    const competitionRankResult = await getCompetitionRank.execute(competitionRankId);
    const competitionRank = match(competitionRankResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={competitionRank.name}>
          <CompetitionRankToolbar competitionRankId={competitionRank.id} />
        </SectionHeader>
        <CompetitionRankView
          initialCompetitionRank={
            CompetitionRankMapper.fromDomainToDto(competitionRank) as CompetitionRankDto
          }
        />
      </>
    );
  } else if (
    competitionRankId === 'new' &&
    ['create-competition-rank'].some((p) => userPermissions.has(p))
  ) {
    return <CompetitionRankForm />;
  } else {
    notFound();
  }
}
