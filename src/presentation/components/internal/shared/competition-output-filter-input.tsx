import { clientContainer } from '@app/client-injection';
import { CompetitionOutput } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionOutputs } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionOutputFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [competitionOutputs, setCompetitionOutputs] = useState<CompetitionOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionOutputs = async () => {
      const getCompetitionOutputs = clientContainer.get<GetCompetitionOutputs>(
        SYMBOLS.GetCompetitionOutputs,
      );

      const result = await getCompetitionOutputs.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition outputs:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionOutputs(data);
      setLoading(false);
    };

    fetchCompetitionOutputs();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionOutputFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionOutputFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionOutputs.map((output) => (
          <MenuItem key={output.id} value={output.id}>
            {output.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
