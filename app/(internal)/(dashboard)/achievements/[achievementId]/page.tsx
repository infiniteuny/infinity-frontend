import {
  GetAchievement,
  GetCompetitionOutputs,
  GetCompetitionRanks,
  GetCompetitionScales,
  GetCompetitionTimeRanges,
  GetSession,
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
import { SectionHeader } from '@app/presentation/components/internal/shared';
import {
  AchievementForm,
  AchievementToolbar,
  AchievementView,
} from '@app/presentation/components/internal/single-achievement';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    achievementId: string;
  }>;
};

export default async function SingleAchievementPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const achievementId = (await params).achievementId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (achievementId !== 'new') {
    const getAchievement = serverContainer.get<GetAchievement>(SYMBOLS.GetAchievement);
    const achievementResult = await getAchievement.execute(achievementId, [
      'team',
      'competition_instance',
      'competition_scale',
      'competition_time_range',
      'competition_output',
      'competition_rank',
    ]);
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
      <>
        <SectionHeader
          title={
            achievement.competitionRank?.name &&
            achievement.competitionInstance?.name &&
            achievement.competitionBranch
              ? `${achievement.competitionRank.name} ${achievement.competitionInstance.name} ${achievement.competitionBranch}`
              : 'N/A'
          }
        >
          <AchievementToolbar achievementId={achievement.id} />
        </SectionHeader>
        <AchievementView
          initialAchievement={AchievementMapper.fromDomainToDto(achievement) as AchievementDto}
        />
      </>
    );
  } else if (
    achievementId === 'new' &&
    ['create-achievement', 'create-own-achievement'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
      SYMBOLS.GetCompetitionScales,
    );
    const getCompetitionTimeRanges = serverContainer.get<GetCompetitionTimeRanges>(
      SYMBOLS.GetCompetitionTimeRanges,
    );
    const getCompetitionOutputs = serverContainer.get<GetCompetitionOutputs>(
      SYMBOLS.GetCompetitionOutputs,
    );
    const getCompetitionRanks = serverContainer.get<GetCompetitionRanks>(
      SYMBOLS.GetCompetitionRanks,
    );

    const [
      competitionScalesResult,
      competitionTimeRangesResult,
      competitionOutputsResult,
      competitionRanksResult,
    ] = await Promise.all([
      getCompetitionScales.execute(undefined, { perPage: 100 }),
      getCompetitionTimeRanges.execute(undefined, { perPage: 100 }),
      getCompetitionOutputs.execute(undefined, { perPage: 100 }),
      getCompetitionRanks.execute(undefined, { perPage: 100 }),
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

    return (
      <AchievementForm
        competitionScales={
          competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
        }
        competitionTimeRanges={
          competitionTimeRanges.map(
            CompetitionTimeRangeMapper.fromDomainToDto,
          ) as CompetitionTimeRangeDto[]
        }
        competitionOutputs={
          competitionOutputs.map(CompetitionOutputMapper.fromDomainToDto) as CompetitionOutputDto[]
        }
        competitionRanks={
          competitionRanks.map(CompetitionRankMapper.fromDomainToDto) as CompetitionRankDto[]
        }
      />
    );
  } else {
    notFound();
  }
}
