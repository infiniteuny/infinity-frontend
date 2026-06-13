import { clientContainer } from '@app/client-injection';
import { CompetitionTimeRange } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionTimeRanges } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionTimeRangeFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [competitionTimeRanges, setCompetitionTimeRanges] = useState<CompetitionTimeRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionTimeRanges = async () => {
      const getCompetitionTimeRanges = clientContainer.get<GetCompetitionTimeRanges>(
        SYMBOLS.GetCompetitionTimeRanges,
      );

      const result = await getCompetitionTimeRanges.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition time ranges:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionTimeRanges(data);
      setLoading(false);
    };

    fetchCompetitionTimeRanges();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionTimeRangeFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionTimeRangeFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionTimeRanges.map((timeRange) => (
          <MenuItem key={timeRange.id} value={timeRange.id}>
            {timeRange.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
