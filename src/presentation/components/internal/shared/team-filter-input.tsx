import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetTeam, GetTeams } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Team } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function TeamFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getTeams = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);
  const getTeam = useMemo(() => clientContainer.get<GetTeam>(SYMBOLS.GetTeam), []);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getTeam.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (team) => {
          setOptions([team]);
          setInputValue(team.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getTeam, item.value]);

  useEffect(() => {
    let active = true;
    const query = searchQuery.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      const teamsResult = await getTeams.execute(undefined, { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(teamsResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([teams]) => {
          setOptions(teams);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getTeams, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, team: Team | null) => {
      if (team) {
        setInputValue(team.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: team?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((team) => team.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? 'No teams found' : 'Type to search team'}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
