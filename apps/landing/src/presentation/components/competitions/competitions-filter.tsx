'use client';

import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { CloseRounded, SearchRounded } from '@mui/icons-material';

export type CompetitionStatusFilter = 'ALL' | 'ONGOING' | 'UPCOMING' | 'PAST';

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: CompetitionStatusFilter;
  onStatusFilterChange: (status: CompetitionStatusFilter) => void;
};

const STATUS_OPTIONS: { value: CompetitionStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Semua Agenda' },
  { value: 'ONGOING', label: 'Berlangsung' },
  { value: 'UPCOMING', label: 'Akan Datang' },
  { value: 'PAST', label: 'Selesai' },
];

export function CompetitionsFilter({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <Card
      elevation={0}
      className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
    >
      <CardContent className="p-4 sm:p-6">
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          className="items-stretch lg:items-center"
        >
          <TextField
            placeholder="Cari nama kompetisi, singkatan, penyelenggara, atau lokasi..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Hapus pencarian"
                      onClick={() => onSearchQueryChange('')}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            className="shrink-0 overflow-x-auto rounded-2xl bg-(--m3-palette-surfaceContainer-main) p-1"
          >
            {STATUS_OPTIONS.map((option) => {
              const active = statusFilter === option.value;
              return (
                <Box
                  key={option.value}
                  component="button"
                  type="button"
                  onClick={() => onStatusFilterChange(option.value)}
                  className={`inline-flex cursor-pointer items-center rounded-xl border-0 px-3 py-1.5 text-xs font-semibold text-nowrap transition-colors ${
                    active
                      ? 'bg-(--m3-palette-primary-main) text-(--m3-palette-onPrimary-main)'
                      : 'bg-transparent text-(--m3-palette-onSurfaceVariant-main) hover:bg-(--m3-palette-surfaceContainerHighest-main) hover:text-(--m3-palette-onSurface-main)'
                  }`}
                >
                  {option.label}
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
