'use client';

import {
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { CloseRounded, SearchRounded } from '@mui/icons-material';

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  availableYears: number[];
  selectedYear?: number;
  onYearChange: (year: number) => void;
};

export function LeaderboardFilter({
  searchQuery,
  onSearchChange,
  availableYears,
  selectedYear,
  onYearChange,
}: Props) {
  return (
    <Card
      elevation={0}
      className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
    >
      <CardContent className="p-4 sm:p-6">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="items-center">
          <TextField
            placeholder="Cari nama anggota..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
                      onClick={() => onSearchChange('')}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          {availableYears.length > 0 && selectedYear !== undefined && (
            <FormControl size="small" className="w-full shrink-0 sm:w-56">
              <InputLabel id="leaderboard-year-select-label">Musim</InputLabel>
              <Select
                labelId="leaderboard-year-select-label"
                id="leaderboard-year-select"
                value={selectedYear}
                label="Musim"
                onChange={(e) => onYearChange(Number(e.target.value))}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
