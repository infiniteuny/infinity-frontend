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
import {
  AchievementForm,
  AchievementToolbar,
  AchievementView,
} from '@app/presentation/components/internal/single-achievement';
import { cache } from 'react';
import {
  GetAchievement,
  GetCompetitionOutputs,
  GetCompetitionRanks,
  GetCompetitionScales,
  GetCompetitionTimeRanges,
  GetSession,
} from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    achievementId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const achievementId = (await params).achievementId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (achievementId !== 'new') {
    const getAchievement = serverContainer.get<GetAchievement>(SYMBOLS.GetAchievement);

    const achievementResult = await cache(
      async () =>
        await getAchievement.execute(achievementId, [
          'team',
          'competition_instance',
          'competition_scale',
          'competition_time_range',
          'competition_output',
          'competition_rank',
        ]),
    )();
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

    return {
      title:
        achievement.competitionRank?.name && achievement.competitionInstance?.name
          ? `${achievement.competitionRank.name} ${achievement.competitionInstance.shortname || achievement.competitionInstance.name} ${achievement.competitionBranch}`
          : 'Achievement Details',
    };
  } else if (
    achievementId === 'new' &&
    ['create-achievement', 'create-own-achievement'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Achievement',
    };
  } else {
    notFound();
  }
}

export default async function SingleAchievementPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const achievementId = (await params).achievementId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (achievementId !== 'new') {
    const getAchievement = serverContainer.get<GetAchievement>(SYMBOLS.GetAchievement);

    const achievementResult = await cache(
      async () =>
        await getAchievement.execute(achievementId, [
          'team',
          'competition_instance',
          'competition_scale',
          'competition_time_range',
          'competition_output',
          'competition_rank',
        ]),
    )();
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

    const title =
      achievement.competitionRank?.name && achievement.competitionInstance?.name
        ? `${achievement.competitionRank.name} ${achievement.competitionInstance.shortname || achievement.competitionInstance.name} ${achievement.competitionBranch}`
        : 'Achievement Details';

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Achievements', url: '/achievements' },
          { label: title, url: `/achievements/${achievement.id}` },
        ]}
      >
        <SectionHeader title={title} backUrl="/achievements">
          <AchievementToolbar achievementId={achievement.id} />
        </SectionHeader>
        <AchievementView
          initialAchievement={AchievementMapper.fromDomainToDto(achievement) as AchievementDto}
        />
      </InternalMain>
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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Achievements', url: '/achievements' },
          { label: 'Create Achievement', url: `/achievements/new` },
        ]}
      >
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
            competitionOutputs.map(
              CompetitionOutputMapper.fromDomainToDto,
            ) as CompetitionOutputDto[]
          }
          competitionRanks={
            competitionRanks.map(CompetitionRankMapper.fromDomainToDto) as CompetitionRankDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
