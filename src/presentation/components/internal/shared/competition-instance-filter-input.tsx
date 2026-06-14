import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetCompetitionInstance, GetCompetitionInstances } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { CompetitionInstance } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function CompetitionInstanceFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );
  const getCompetitionInstance = useMemo(
    () => clientContainer.get<GetCompetitionInstance>(SYMBOLS.GetCompetitionInstance),
    [],
  );

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<CompetitionInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getCompetitionInstance.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (competitionInstance) => {
          setOptions([competitionInstance]);
          setInputValue(competitionInstance.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getCompetitionInstance, item.value]);

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

      const competitionInstancesResult = await getCompetitionInstances.execute(
        undefined,
        { name: query },
        undefined,
        {
          perPage: 10,
        },
      );

      if (!active) return;

      match(competitionInstancesResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([competitionInstances]) => {
          setOptions(competitionInstances);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getCompetitionInstances, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, competitionInstance: CompetitionInstance | null) => {
      if (competitionInstance) {
        setInputValue(competitionInstance.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: competitionInstance?.id ?? '' });
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
        searchQuery ? 'No competition instances found' : 'Type to search competition instance'
      }
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
