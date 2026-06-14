import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetMajor, GetMajors } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Major } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function MajorFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getMajors = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);
  const getMajor = useMemo(() => clientContainer.get<GetMajor>(SYMBOLS.GetMajor), []);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getMajor.execute(String(item.value), ['degree']);

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (major) => {
          setOptions([major]);
          setInputValue(`${major.degree?.name ?? ''} - ${major.name}`);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getMajor, item.value]);

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

      const majorsResult = await getMajors.execute(['degree'], { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(majorsResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([majors]) => {
          setOptions(majors);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getMajors, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, major: Major | null) => {
      if (major) {
        setInputValue(`${major.degree?.name ?? ''} - ${major.name}`);
        setSearchQuery('');
      }
      applyValue({ ...item, value: major?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((major) => major.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => `${option.degree?.name ?? ''} - ${option.name}`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? 'No majors found' : 'Type to search major'}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
