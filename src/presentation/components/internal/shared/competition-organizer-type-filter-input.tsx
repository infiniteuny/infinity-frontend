import { clientContainer } from '@app/client-injection';
import { CompetitionOrganizerType } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionOrganizerTypes } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionOrganizerTypeFilterInput({
  item,
  applyValue,
}: GridFilterInputValueProps) {
  const [competitionOrganizerTypes, setCompetitionOrganizerTypes] = useState<
    CompetitionOrganizerType[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionOrganizerTypes = async () => {
      const getCompetitionOrganizerTypes = clientContainer.get<GetCompetitionOrganizerTypes>(
        SYMBOLS.GetCompetitionOrganizerTypes,
      );

      const result = await getCompetitionOrganizerTypes.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition organizer types:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionOrganizerTypes(data);
      setLoading(false);
    };

    fetchCompetitionOrganizerTypes();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionOrganizerTypeFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionOrganizerTypeFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionOrganizerTypes.map((organizerType) => (
          <MenuItem key={organizerType.id} value={organizerType.id}>
            {organizerType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
