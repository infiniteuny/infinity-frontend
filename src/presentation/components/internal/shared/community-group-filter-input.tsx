import { clientContainer } from '@app/client-injection';
import { CommunityGroup } from '@app/domain/entities';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GetCommunityGroups } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useState } from 'react';

export function CommunityGroupFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityGroups = async () => {
      const getCommunityGroups = clientContainer.get<GetCommunityGroups>(
        SYMBOLS.GetCommunityGroups,
      );

      const result = await getCommunityGroups.execute(undefined, undefined, {
        perPage: 50,
      });

      const data = match(result, {
        onLeft: (error) => {
          console.error('Failed to fetch community groups:', error);
          return [];
        },
        onRight: (data) => data[0],
      });

      setCommunityGroups(data);
      setLoading(false);
    };

    fetchCommunityGroups();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id="communityGroupFilter-label">
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId="communityGroupFilter-label"
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {communityGroups.map((group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
