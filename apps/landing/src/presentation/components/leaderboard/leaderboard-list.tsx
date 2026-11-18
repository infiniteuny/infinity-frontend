'use client';

import Link from 'next/link';
import { AchievementLeaderboardDto } from '@infiniteuny/infinity-infrastructure';
import {
  ArrowForwardRounded,
  EmojiEventsRounded,
  MilitaryTechRounded,
  Person,
  RestartAltRounded,
  SearchOffRounded,
  StarsOutlined,
  WorkspacePremiumRounded,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LeaderboardItemCard } from './leaderboard-item-card';

export type RankedLeaderboardEntry = {
  entry: AchievementLeaderboardDto;
  rank: number;
};

type Props = {
  items: RankedLeaderboardEntry[];
  maxPoints: number;
  isFiltering?: boolean;
  onResetSearch?: () => void;
};

function PodiumCard({ item, maxPoints }: { item: RankedLeaderboardEntry; maxPoints: number }) {
  const { entry, rank } = item;
  const user = entry.user;
  const memberName = user?.name ?? 'Anggota INFINITE';
  const username = user?.username ?? entry.user_id;
  const href = `/members/${encodeURIComponent(username)}`;
  const isFirst = rank === 1;
  const pointRatio =
    maxPoints > 0 ? Math.max(12, Math.round((entry.total_points / maxPoints) * 100)) : 100;

  const badgeStyles =
    rank === 1
      ? 'bg-(--m3-palette-primary-main) text-(--m3-palette-onPrimary-main)'
      : rank === 2
        ? 'bg-(--m3-palette-secondaryContainer-main) text-(--m3-palette-onSecondaryContainer-main)'
        : 'bg-(--m3-palette-tertiaryContainer-main) text-(--m3-palette-onTertiaryContainer-main)';

  const RankIcon =
    rank === 1 ? EmojiEventsRounded : rank === 2 ? WorkspacePremiumRounded : MilitaryTechRounded;

  return (
    <Card
      elevation={0}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-0 shadow-none transition-colors duration-200 ${
        isFirst
          ? 'bg-(--m3-palette-surfaceContainerHighest-main) ring-2 ring-(--m3-palette-primary-main)/40'
          : 'bg-(--m3-palette-surfaceContainerHigh-main) hover:bg-(--m3-palette-surfaceContainerHighest-main)'
      }`}
    >
      <CardActionArea component={Link} href={href} className="flex flex-1 flex-col items-stretch">
        <CardContent className="flex flex-1 flex-col justify-between p-6 text-center">
          <Box>
            {/* Top Rank Pill */}
            <Stack direction="row" className="mb-2 items-center justify-end">
              <Box
                component="span"
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-serif text-xs font-extrabold tabular-nums ${badgeStyles}`}
              >
                <RankIcon sx={{ fontSize: 15 }} />
                <span>#{rank}</span>
              </Box>
            </Stack>

            {/* Avatar */}
            <Avatar
              alt={memberName}
              className={`${
                isFirst ? 'h-22 w-22' : 'h-18 w-18'
              } mx-auto mb-4 bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)`}
            >
              <Person sx={{ fontSize: isFirst ? 44 : 36 }} />
            </Avatar>

            {/* Member Name */}
            <Typography variant="h6" className="leading-snug font-extrabold wrap-break-word">
              {memberName}
            </Typography>

            {user?.is_extraordinary && (
              <Chip
                icon={<StarsOutlined sx={{ fontSize: 13 }} />}
                label="Anggota Luar Biasa"
                color="secondary"
                size="small"
                className="mt-2.5 h-5 text-[11px] font-semibold"
              />
            )}
          </Box>

          {/* Bottom Score Box */}
          <Box className="mt-6 rounded-2xl bg-(--m3-palette-surfaceContainer-main) p-3.5">
            <Stack direction="row" className="items-baseline justify-between">
              <Typography
                variant="caption"
                className="font-semibold text-(--m3-palette-onSurfaceVariant-main)"
              >
                Total Skor
              </Typography>
              <Stack direction="row" spacing={0.5} className="items-center">
                <Typography
                  variant="h6"
                  className="font-serif leading-none font-extrabold text-(--m3-palette-primary-main) tabular-nums"
                >
                  {entry.total_points.toLocaleString('id-ID')}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-(--m3-palette-onSurfaceVariant-main)"
                >
                  Poin
                </Typography>
              </Stack>
            </Stack>

            <Box className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-(--m3-palette-surfaceContainerHighest-main)">
              <Box
                className="h-full rounded-full bg-(--m3-palette-primary-main)"
                style={{ width: `${pointRatio}%` }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              className="mt-2.5 items-center justify-center text-xs font-semibold text-(--m3-palette-onSurfaceVariant-main) transition-colors group-hover:text-(--m3-palette-primary-main)"
            >
              <span>Lihat Profil & Prestasi</span>
              <ArrowForwardRounded sx={{ fontSize: 14 }} />
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function LeaderboardList({ items, maxPoints, isFiltering = false, onResetSearch }: Props) {
  if (items.length === 0) {
    return (
      <Box component="section">
        <Card
          elevation={0}
          className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
        >
          <CardContent className="p-10 text-center sm:p-14">
            <Stack className="mx-auto max-w-md items-center">
              <Avatar
                variant="rounded"
                className="mb-4 h-14 w-14 rounded-2xl bg-(--m3-palette-surfaceContainer-main) text-(--m3-palette-onSurfaceVariant-main)"
              >
                <SearchOffRounded />
              </Avatar>
              <Typography variant="h6" className="font-bold">
                {isFiltering
                  ? 'Anggota tidak ditemukan pada peringkat ini'
                  : 'Belum ada data peringkat prestasi'}
              </Typography>
              <Typography
                variant="body2"
                className="mt-1.5 text-(--m3-palette-onSurfaceVariant-main)"
              >
                {isFiltering
                  ? 'Tidak ada anggota dengan nama atau username yang cocok dengan kata kunci pencarian.'
                  : 'Silakan pilih musim kompetisi lainnya.'}
              </Typography>
              {isFiltering && onResetSearch && (
                <Button
                  variant="tonal"
                  size="small"
                  startIcon={<RestartAltRounded fontSize="small" />}
                  onClick={onResetSearch}
                  className="mt-5"
                >
                  Reset Pencarian
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const showPodium = !isFiltering && items.length > 0;
  const podiumItems = showPodium ? items.slice(0, 3) : [];
  const listItems = showPodium ? items.slice(3) : items;

  const getDesktopOrderClass = (rank: number) => {
    if (podiumItems.length === 3) {
      if (rank === 1) return 'md:order-2 md:-mt-3';
      if (rank === 2) return 'md:order-1';
      return 'md:order-3';
    }
    return '';
  };

  return (
    <Box component="section">
      {showPodium && (
        <Grid container spacing={3} className="items-stretch">
          {podiumItems.map((item) => (
            <Grid
              key={item.entry.id}
              size={{
                xs: 12,
                md: podiumItems.length === 1 ? 12 : podiumItems.length === 2 ? 6 : 4,
              }}
              className={getDesktopOrderClass(item.rank)}
            >
              <PodiumCard item={item} maxPoints={maxPoints} />
            </Grid>
          ))}
        </Grid>
      )}

      {listItems.length > 0 && (
        <Box className={showPodium ? 'mt-8' : ''}>
          <Stack spacing={1.75}>
            {listItems.map((item) => (
              <LeaderboardItemCard
                key={item.entry.id}
                entry={item.entry}
                rank={item.rank}
                maxPoints={maxPoints}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
