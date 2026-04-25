import { GetCompetitionRank } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionRankDto, CompetitionRankMapper } from '@app/infrastructure/dtos';
import { CompetitionRankForm } from '@app/presentation/components/internal/single-competition-rank';

type Props = {
  params: Promise<{
    competitionRankId: string;
  }>;
};

export default async function SingleCompetitionRankEditPage({ params }: Props) {
  const getCompetitionRank = serverContainer.get<GetCompetitionRank>(SYMBOLS.GetCompetitionRank);
  const competitionRankId = (await params).competitionRankId;

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
    <CompetitionRankForm
      initialCompetitionRank={
        CompetitionRankMapper.fromDomaintoDto(competitionRank) as CompetitionRankDto
      }
    />
  );
}
