import { clientContainer } from '@app/client-injection';
import { CompetitionRank } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCompetitionRanks } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CompetitionRankFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [competitionRanks, setCompetitionRanks] = useState<CompetitionRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitionRanks = async () => {
      const getCompetitionRanks = clientContainer.get<GetCompetitionRanks>(
        SYMBOLS.GetCompetitionRanks,
      );

      const result = await getCompetitionRanks.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch competition ranks:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCompetitionRanks(data);
      setLoading(false);
    };

    fetchCompetitionRanks();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="competitionRankFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="competitionRankFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {competitionRanks.map((rank) => (
          <MenuItem key={rank.id} value={rank.id}>
            {rank.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
