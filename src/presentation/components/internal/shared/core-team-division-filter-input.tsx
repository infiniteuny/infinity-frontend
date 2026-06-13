import { clientContainer } from '@app/client-injection';
import { CoreTeamDivision } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCoreTeamDivisions } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CoreTeamDivisionFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [coreTeamDivisions, setCoreTeamDivisions] = useState<CoreTeamDivision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoreTeamDivisions = async () => {
      const getCoreTeamDivisions = clientContainer.get<GetCoreTeamDivisions>(
        SYMBOLS.GetCoreTeamDivisions,
      );

      const result = await getCoreTeamDivisions.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch core team divisions:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCoreTeamDivisions(data);
      setLoading(false);
    };

    fetchCoreTeamDivisions();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="coreTeamDivisionFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="coreTeamDivisionFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {coreTeamDivisions.map((division) => (
          <MenuItem key={division.id} value={division.id}>
            {division.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
