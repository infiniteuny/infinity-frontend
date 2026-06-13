import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetAchievements } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  AchievementsList,
  AchievementsToolbar,
} from '@app/presentation/components/internal/achievements';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Achievements',
};

export default async function AchievementsPage() {
  const getAchievements = serverContainer.get<GetAchievements>(SYMBOLS.GetAchievements);

  const result = await getAchievements.execute(
    [
      'team',
      'competition_instance',
      'competition_scale',
      'competition_time_range',
      'competition_output',
      'competition_rank',
    ],
    undefined,
    undefined,
    { perPage: 25 },
  );
  const [achievements, paginationOptions] = match(result, {
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
      ]}
    >
      <SectionHeader title="Achievements">
        <AchievementsToolbar />
      </SectionHeader>
      <AchievementsList
        initialAchievements={
          achievements.map(AchievementMapper.fromDomainToDto) as AchievementDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
