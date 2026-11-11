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
import { CommunityGroupAdminDto } from '@infiniteuny/infinity-infrastructure';
import { SearchRounded } from '@mui/icons-material';

export type CommunityGroupFilterItem = {
  id: string;
  name: string;
};

type Props = {
  admins: CommunityGroupAdminDto[];
  selectedAdmin?: CommunityGroupAdminDto;
  onYearChange: (year: number) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  communityGroups: CommunityGroupFilterItem[];
  selectedGroup: string;
  onSelectGroup: (groupId: string) => void;
  totalMembersCount: number;
};

export function CommunityGroupAdminsFilter({
  admins,
  selectedAdmin,
  onYearChange,
  searchQuery,
  onSearchQueryChange,
  communityGroups,
  selectedGroup,
  onSelectGroup,
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
              placeholder="Cari nama administrator, community group, atau program studi..."
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

            {admins.length > 0 && selectedAdmin && (
              <FormControl size="small" className="w-full shrink-0 sm:w-56">
                <InputLabel id="cg-admin-year-select-label">Periode</InputLabel>
                <Select
                  labelId="cg-admin-year-select-label"
                  id="cg-admin-year-select"
                  value={selectedAdmin.year}
                  label="Periode"
                  onChange={(e) => onYearChange(Number(e.target.value))}
                >
                  {admins.map((admin) => (
                    <MenuItem key={admin.id} value={admin.year}>
                      {admin.year}
                      {admin.is_active ? ' (Aktif)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>

          {communityGroups.length > 0 && (
            <Stack direction="row" className="flex-wrap gap-2">
              <Chip
                label={`Semua Grup (${totalMembersCount})`}
                color={selectedGroup === 'ALL' ? 'primary' : 'default'}
                onClick={() => onSelectGroup('ALL')}
                clickable
              />
              {communityGroups.map((group) => (
                <Chip
                  key={group.id}
                  label={group.name}
                  color={selectedGroup === group.id ? 'primary' : 'default'}
                  onClick={() => onSelectGroup(group.id)}
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
