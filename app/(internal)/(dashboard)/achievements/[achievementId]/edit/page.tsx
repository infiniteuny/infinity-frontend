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
import {
  GetAchievement,
  GetCompetitionOutputs,
  GetCompetitionRanks,
  GetCompetitionScales,
  GetCompetitionTimeRanges,
  GetSession,
} from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { cache } from 'react';

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

  if (['update-achievement', 'update-own-achievement'].some((p) => userPermissions.has(p))) {
    const getAchievement = serverContainer.get<GetAchievement>(SYMBOLS.GetAchievement);

    const achievementResult = await cache(
      async () =>
        await getAchievement.execute(achievementId, [
          'team',
          'team.members',
          'competition_instance',
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

    if (
      !['update-achievement'].some((p) => userPermissions.has(p)) &&
      !achievement.team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    return {
      title:
        achievement.competitionRank?.name && achievement.competitionInstance?.name
          ? `Edit ${achievement.competitionRank.name} ${achievement.competitionInstance.shortname || achievement.competitionInstance.name} ${achievement.competitionBranch}`
          : 'Edit Achievement',
    };
  } else {
    notFound();
  }
}

export default async function SingleAchievementEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-achievement', 'update-own-achievement'].some((p) => userPermissions.has(p))) {
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
    const getCompetitionRanks = serverContainer.get<GetCompetitionRanks>(
      SYMBOLS.GetCompetitionRanks,
    );
    const achievementId = (await params).achievementId;

    const achievementResult = await cache(
      async () =>
        await getAchievement.execute(achievementId, [
          'team',
          'team.members',
          'competition_instance',
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

    if (
      !['update-achievement'].some((p) => userPermissions.has(p)) &&
      !achievement.team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    const [
      competitionScalesResult,
      competitionTimeRangesResult,
      competitionOutputsResult,
      competitionRanksResult,
    ] = await Promise.all([
      getCompetitionScales.execute(undefined, undefined, { perPage: 100 }),
      getCompetitionTimeRanges.execute(undefined, undefined, { perPage: 100 }),
      getCompetitionOutputs.execute(undefined, undefined, { perPage: 100 }),
      getCompetitionRanks.execute(undefined, undefined, { perPage: 100 }),
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
          {
            label:
              achievement.competitionRank?.name && achievement.competitionInstance?.name
                ? `${achievement.competitionRank.name} ${achievement.competitionInstance.shortname || achievement.competitionInstance.name} ${achievement.competitionBranch}`
                : 'Achievement Details',
            url: `/achievements/${achievement.id}`,
          },
          { label: 'Edit', url: `/achievements/${achievement.id}/edit` },
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
          initialAchievement={AchievementMapper.fromDomainToDto(achievement) as AchievementDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
