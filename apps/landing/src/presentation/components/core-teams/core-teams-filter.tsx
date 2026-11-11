'use client';

import {
  Card,
  CardContent,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { CoreTeamDto } from '@infiniteuny/infinity-infrastructure';
import { SearchRounded } from '@mui/icons-material';

export type CoreTeamDivisionItem = {
  id: string;
  name: string;
  priority: number;
};

type Props = {
  coreTeams: CoreTeamDto[];
  selectedCoreTeam?: CoreTeamDto;
  onYearChange: (year: number) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  divisions: CoreTeamDivisionItem[];
  selectedDivision: string;
  onSelectDivision: (divisionId: string) => void;
  totalMembersCount: number;
};

export function CoreTeamsFilter({
  coreTeams,
  selectedCoreTeam,
  onYearChange,
  searchQuery,
  onSearchQueryChange,
  divisions,
  selectedDivision,
  onSelectDivision,
  totalMembersCount,
}: Props) {
  return (
    <Card
      elevation={0}
      className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
    >
      <CardContent className="p-4 sm:p-6">
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="items-center">
            <TextField
              placeholder="Cari nama pengurus, divisi, atau program studi..."
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
                },
              }}
            />

            {coreTeams.length > 0 && selectedCoreTeam && (
              <FormControl size="small" className="w-full shrink-0 sm:w-56">
                <InputLabel id="core-team-year-select-label">Periode</InputLabel>
                <Select
                  labelId="core-team-year-select-label"
                  id="core-team-year-select"
                  value={selectedCoreTeam.year}
                  label="Periode"
                  onChange={(e) => onYearChange(Number(e.target.value))}
                >
                  {coreTeams.map((team) => (
                    <MenuItem key={team.id} value={team.year}>
                      {team.year}
                      {team.is_active ? ' (Aktif)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>

          {divisions.length > 0 && (
            <Stack direction="row" className="flex-wrap gap-2">
              <Chip
                label={`Semua Divisi (${totalMembersCount})`}
                color={selectedDivision === 'ALL' ? 'primary' : 'default'}
                onClick={() => onSelectDivision('ALL')}
                clickable
              />
              {divisions.map((div) => (
                <Chip
                  key={div.id}
                  label={div.name}
                  color={selectedDivision === div.id ? 'primary' : 'default'}
                  onClick={() => onSelectDivision(div.id)}
                  clickable
                />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
