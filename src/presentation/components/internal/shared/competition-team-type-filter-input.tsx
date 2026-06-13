import { clientContainer } from '@app/client-injection';
import { CompetitionTeamType } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionTeamTypes } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionTeamTypeFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [competitionTeamTypes, setCompetitionTeamTypes] = useState<CompetitionTeamType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionTeamTypes = async () => {
      const getCompetitionTeamTypes = clientContainer.get<GetCompetitionTeamTypes>(
        SYMBOLS.GetCompetitionTeamTypes,
      );

      const result = await getCompetitionTeamTypes.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition team types:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionTeamTypes(data);
      setLoading(false);
    };

    fetchCompetitionTeamTypes();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionTeamTypeFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionTeamTypeFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionTeamTypes.map((teamType) => (
          <MenuItem key={teamType.id} value={teamType.id}>
            {teamType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
