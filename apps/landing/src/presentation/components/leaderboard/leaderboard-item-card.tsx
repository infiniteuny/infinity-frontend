'use client';

import Link from 'next/link';
import { AchievementLeaderboardDto } from '@infiniteuny/infinity-infrastructure';
import {
  ArrowForwardRounded,
  EmojiEventsRounded,
  Person,
  StarsOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

type Props = {
  entry: AchievementLeaderboardDto;
  rank: number;
  maxPoints: number;
};

export function LeaderboardItemCard({ entry, rank, maxPoints }: Props) {
  const user = entry.user;
  const memberName = user?.name ?? 'Anggota INFINITE';
  const username = user?.username ?? entry.user_id;
  const href = `/members/${encodeURIComponent(username)}`;
  const isTopThree = rank <= 3;
  const pointRatio =
    maxPoints > 0 ? Math.max(8, Math.round((entry.total_points / maxPoints) * 100)) : 0;

  return (
    <Card
      elevation={0}
      className="group overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-200 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
    >
      <CardActionArea component={Link} href={href}>
        <CardContent className="p-4 sm:px-6 sm:py-4.5">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            className="items-start justify-between sm:items-center"
          >
            <Stack direction="row" spacing={2} className="min-w-0 flex-1 items-center">
              <Box
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-serif text-sm font-extrabold tabular-nums ${
                  isTopThree
                    ? 'bg-(--m3-palette-primary-main) text-(--m3-palette-onPrimary-main)'
                    : 'bg-(--m3-palette-surfaceContainer-main) text-(--m3-palette-onSurfaceVariant-main)'
                }`}
              >
                #{rank}
              </Box>

              <Avatar
                alt={memberName}
                className="h-12 w-12 shrink-0 bg-(--m3-palette-secondaryContainer-main) text-(--m3-palette-onSecondaryContainer-main)"
              >
                <Person sx={{ fontSize: 24 }} />
              </Avatar>

              <Box className="min-w-0 flex-1">
                <Stack direction="row" className="flex-wrap items-center gap-1.5">
                  <Typography variant="subtitle1" className="truncate font-bold">
                    {memberName}
                  </Typography>
                  {user?.is_extraordinary && (
                    <Chip
                      icon={<StarsOutlined sx={{ fontSize: 13 }} />}
                      label="Luar Biasa"
                      color="secondary"
                      size="small"
                      className="h-5 text-[11px] font-semibold"
                    />
                  )}
                </Stack>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              className="w-full shrink-0 items-center justify-between pl-13 sm:w-auto sm:justify-end sm:pl-0"
            >
              <Box className="hidden w-28 flex-col items-end gap-1 md:flex">
                <Box className="h-1.5 w-full overflow-hidden rounded-full bg-(--m3-palette-surfaceContainer-main)">
                  <Box
                    className="h-full rounded-full bg-(--m3-palette-primary-main)"
                    style={{ width: `${pointRatio}%` }}
                  />
                </Box>
              </Box>

              <Chip
                icon={<EmojiEventsRounded fontSize="small" />}
                label={`${entry.total_points.toLocaleString('id-ID')} Poin`}
                color="primary"
                className="bg-(--m3-palette-primaryContainer-main) px-2 font-serif font-extrabold text-(--m3-palette-onPrimaryContainer-main) tabular-nums"
              />

              <ArrowForwardRounded
                fontSize="small"
                className="text-(--m3-palette-onSurfaceVariant-main) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-(--m3-palette-primary-main)"
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
