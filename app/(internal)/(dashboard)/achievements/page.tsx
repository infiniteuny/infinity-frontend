import { GetAchievements } from '@app/application';
import { match } from 'effect/Either';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  AchievementsList,
  AchievementsToolbar,
} from '@app/presentation/components/internal/achievements';

export default async function AchievementsPage() {
  const getAchievements = serverContainer.get<GetAchievements>(SYMBOLS.GetAchievements);
  const result = await getAchievements.execute(undefined, { perPage: 25 });
  const [achievements, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Achievements">
        <AchievementsToolbar />
      </SectionHeader>
      <AchievementsList
        initialAchievements={
          achievements.map(AchievementMapper.fromDomaintoDto) as AchievementDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
