'use client';

import { CompetitionView } from './competition-view';
import { DocumentsView } from './documents-view';
import { AchievementDto, AchievementMapper } from '@infiniteuny/infinity-infrastructure';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialAchievement: AchievementDto;
};

export function AchievementView({ initialAchievement }: Props) {
  const achievement = AchievementMapper.fromDtoToDomain(initialAchievement);

  return (
    <>
      <GeneralView achievement={achievement} />
      <CompetitionView achievement={achievement} />
      <DocumentsView achievement={achievement} />
      <MetadataView achievement={achievement} />
    </>
  );
}
