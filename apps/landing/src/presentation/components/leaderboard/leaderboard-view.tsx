'use client';

import { AchievementLeaderboardDto } from '@infiniteuny/infinity-infrastructure';
import { Box, Container } from '@mui/material';
import { LeaderboardFilter } from './leaderboard-filter';
import { LeaderboardHeader } from './leaderboard-header';
import { LeaderboardList, RankedLeaderboardEntry } from './leaderboard-list';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  availableYears: number[];
  selectedYear?: number;
  leaderboards: AchievementLeaderboardDto[];
};

export function LeaderboardView({ availableYears, selectedYear, leaderboards }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedYear === undefined) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('year') !== String(selectedYear)) {
      params.set('year', String(selectedYear));
      router.replace(`/achievements?${params.toString()}`, { scroll: false });
    }
  }, [selectedYear, router]);

  const handleYearChange = (year: number) => {
    router.push(`/achievements?year=${encodeURIComponent(String(year))}`);
  };

  const rankedEntries = useMemo<RankedLeaderboardEntry[]>(() => {
    return [...leaderboards]
      .sort((a, b) => b.total_points - a.total_points)
      .map((entry, idx) => ({
        entry,
        rank: idx + 1,
      }));
  }, [leaderboards]);

  const filteredItems = useMemo<RankedLeaderboardEntry[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rankedEntries;
    return rankedEntries.filter(({ entry }) => {
      const name = (entry.user?.name ?? '').toLowerCase();
      const username = (entry.user?.username ?? '').toLowerCase();
      return name.includes(query) || username.includes(query);
    });
  }, [rankedEntries, searchQuery]);

  const topPoints = useMemo(
    () => (rankedEntries.length > 0 ? rankedEntries[0].entry.total_points : 0),
    [rankedEntries],
  );

  return (
    <Box className="flex min-h-[calc(100vh-9.625rem)] flex-col">
      <Box className="pt-12 pb-8 md:pt-16 md:pb-12">
        <Container maxWidth="lg">
          <LeaderboardHeader selectedYear={selectedYear} />
        </Container>
      </Box>

      <Box className="relative">
        <Box
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -bottom-px bg-(--m3-palette-surfaceContainerLowest-main)"
        />
        <Container maxWidth="lg" className="relative z-10">
          <LeaderboardFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </Container>
      </Box>

      <Box className="flex-1 bg-(--m3-palette-surfaceContainerLowest-main) pt-10 pb-16 md:pt-12 md:pb-20">
        <Container maxWidth="lg">
          <LeaderboardList
            items={filteredItems}
            maxPoints={topPoints}
            isFiltering={searchQuery.trim() !== ''}
            onResetSearch={() => setSearchQuery('')}
          />
        </Container>
      </Box>
    </Box>
  );
}
