import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetCompetition, GetCompetitions } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Competition } from '@infiniteuny/infinity-domain';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function CompetitionFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getCompetitions = useMemo(
    () => clientContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions),
    [],
  );
  const getCompetition = useMemo(
    () => clientContainer.get<GetCompetition>(SYMBOLS.GetCompetition),
    [],
  );

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getCompetition.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (competition) => {
          setOptions([competition]);
          setInputValue(competition.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getCompetition, item.value]);

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

      const competitionsResult = await getCompetitions.execute({ name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(competitionsResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([competitions]) => {
          setOptions(competitions);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getCompetitions, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, competition: Competition | null) => {
      if (competition) {
        setInputValue(competition.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: competition?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((c) => c.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={
        searchQuery ? 'No competition series found' : 'Type to search competition series'
      }
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
