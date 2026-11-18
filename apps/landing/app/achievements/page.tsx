import {
  AchievementLeaderboardDto,
  AchievementLeaderboardMapper,
} from '@infiniteuny/infinity-infrastructure';
import { cache } from 'react';
import {
  GetAchievementLeaderboardYears,
  GetAchievementLeaderboards,
} from '@infiniteuny/infinity-application';
import { isRight } from 'effect/Either';
import { LeaderboardView } from '@app/presentation/components/leaderboard';
import { Main } from '@app/presentation/components/shared';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: Promise<{ year?: string }>;
};

const getCachedAvailableYears = cache(async (): Promise<number[]> => {
  const getYears = serverContainer.get<GetAchievementLeaderboardYears>(
    SYMBOLS.GetAchievementLeaderboardYears,
  );
  try {
    const yearsResult = await getYears.execute({ perPage: 50 }, undefined, false);
    if (isRight(yearsResult)) {
      const [years] = yearsResult.right;
      return [...years].sort((a, b) => b - a);
    }
  } catch {
    // Fallback to empty state
  }
  return [];
});

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = searchParams ? await searchParams : {};
  const yearParam = resolvedParams?.year ? Number(resolvedParams.year) : undefined;
  const availableYears = await getCachedAvailableYears();
  const selectedYear =
    (yearParam && availableYears.includes(yearParam) ? yearParam : undefined) ?? availableYears[0];

  return {
    title: selectedYear !== undefined ? `Prestasi ${selectedYear}` : 'Prestasi',
    description:
      'Papan peringkat prestasi anggota INFINITE berdasarkan akumulasi poin kemenangan kompetisi.',
  };
}

export default async function AchievementsPage({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {};
  const yearParam = resolvedParams?.year ? Number(resolvedParams.year) : undefined;

  const getLeaderboards = serverContainer.get<GetAchievementLeaderboards>(
    SYMBOLS.GetAchievementLeaderboards,
  );

  const availableYears = await getCachedAvailableYears();

  const selectedYear =
    (yearParam && availableYears.includes(yearParam) ? yearParam : undefined) ?? availableYears[0];

  let leaderboards: AchievementLeaderboardDto[] = [];
  if (selectedYear !== undefined) {
    try {
      const leaderboardsResult = await getLeaderboards.execute(
        selectedYear,
        ['user'],
        undefined,
        { totalPoints: 'DESC' },
        { perPage: 100 },
        undefined,
        false,
      );
      if (isRight(leaderboardsResult)) {
        const [items] = leaderboardsResult.right;
        leaderboards = items.map(
          (item) => AchievementLeaderboardMapper.fromDomainToDto(item) as AchievementLeaderboardDto,
        );
      }
    } catch {
      // Fallback to empty state
    }
  }

  return (
    <Main>
      <LeaderboardView
        availableYears={availableYears}
        selectedYear={selectedYear}
        leaderboards={leaderboards}
      />
    </Main>
  );
}
