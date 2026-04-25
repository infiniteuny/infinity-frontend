import {
  GetAchievement,
  GetCompetitionOutputs,
  GetCompetitionRanks,
  GetCompetitionScales,
  GetCompetitionTimeRanges,
} from '@app/application';
import { match } from 'effect/Either';
import {
  AchievementDto,
  AchievementMapper,
  CompetitionOutputDto,
  CompetitionOutputMapper,
  CompetitionRankDto,
  CompetitionRankMapper,
  CompetitionScaleDto,
  CompetitionScaleMapper,
  CompetitionTimeRangeDto,
  CompetitionTimeRangeMapper,
} from '@app/infrastructure/dtos';
import { AchievementForm } from '@app/presentation/components/internal/single-achievement';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    achievementId: string;
  }>;
};

export default async function SingleAchievementEditPage({ params }: Props) {
  const getAchievement = serverContainer.get<GetAchievement>(SYMBOLS.GetAchievement);
  const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
    SYMBOLS.GetCompetitionScales,
  );
  const getCompetitionTimeRanges = serverContainer.get<GetCompetitionTimeRanges>(
    SYMBOLS.GetCompetitionTimeRanges,
  );
  const getCompetitionOutputs = serverContainer.get<GetCompetitionOutputs>(
    SYMBOLS.GetCompetitionOutputs,
  );
  const getCompetitionRanks = serverContainer.get<GetCompetitionRanks>(SYMBOLS.GetCompetitionRanks);
  const achievementId = (await params).achievementId;

  const [
    competitionScalesResult,
    competitionTimeRangesResult,
    competitionOutputsResult,
    competitionRanksResult,
    achievementResult,
  ] = await Promise.all([
    getCompetitionScales.execute(undefined, { perPage: 100 }),
    getCompetitionTimeRanges.execute(undefined, { perPage: 100 }),
    getCompetitionOutputs.execute(undefined, { perPage: 100 }),
    getCompetitionRanks.execute(undefined, { perPage: 100 }),
    getAchievement.execute(achievementId, ['team', 'competition_instance']),
  ]);

  const [competitionScales] = match(competitionScalesResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const [competitionTimeRanges] = match(competitionTimeRangesResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const [competitionOutputs] = match(competitionOutputsResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const [competitionRanks] = match(competitionRanksResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const achievement = match(achievementResult, {
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
    <AchievementForm
      competitionScales={
        competitionScales.map(CompetitionScaleMapper.fromDomaintoDto) as CompetitionScaleDto[]
      }
      competitionTimeRanges={
        competitionTimeRanges.map(
          CompetitionTimeRangeMapper.fromDomaintoDto,
        ) as CompetitionTimeRangeDto[]
      }
      competitionOutputs={
        competitionOutputs.map(CompetitionOutputMapper.fromDomaintoDto) as CompetitionOutputDto[]
      }
      competitionRanks={
        competitionRanks.map(CompetitionRankMapper.fromDomaintoDto) as CompetitionRankDto[]
      }
      initialAchievement={AchievementMapper.fromDomaintoDto(achievement) as AchievementDto}
    />
  );
}
