import { clientContainer } from '@app/client-injection';
import { CompetitionScale } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionScales } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionScaleFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [competitionScales, setCompetitionScales] = useState<CompetitionScale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionScales = async () => {
      const getCompetitionScales = clientContainer.get<GetCompetitionScales>(
        SYMBOLS.GetCompetitionScales,
      );

      const result = await getCompetitionScales.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition scales:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionScales(data);
      setLoading(false);
    };

    fetchCompetitionScales();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionScaleFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionScaleFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionScales.map((scale) => (
          <MenuItem key={scale.id} value={scale.id}>
            {scale.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
