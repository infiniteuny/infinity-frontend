import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetTeams } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Team } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function TeamFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getTeams = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);

  const [teamInput, setTeamInput] = useState('');
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = teamInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsTeamLoading(true);

      const teamsResult = await getTeams.execute(undefined, { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(teamsResult, {
        onLeft: () => {
          setTeamOptions([]);
        },
        onRight: ([teams]) => {
          setTeamOptions(teams);
        },
      });

      setIsTeamLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getTeams, teamInput]);

  return (
    <Autocomplete
      options={teamOptions}
      value={teamOptions.find((team) => team.id === item.value) ?? null}
      onChange={(_, team) => {
        applyValue({ ...item, value: team?.id ?? '' });
      }}
      inputValue={teamInput}
      onInputChange={(_, value) => {
        setTeamInput(value);

        if (value.trim().length < 1) {
          setTeamOptions([]);
          setIsTeamLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isTeamLoading}
      noOptionsText={teamInput ? 'No teams found' : 'Type to search team'}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
