import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetDegree, GetDegrees } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Degree } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function DegreeFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getDegrees = useMemo(() => clientContainer.get<GetDegrees>(SYMBOLS.GetDegrees), []);
  const getDegree = useMemo(() => clientContainer.get<GetDegree>(SYMBOLS.GetDegree), []);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Degree[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getDegree.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (degree) => {
          setOptions([degree]);
          setInputValue(degree.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getDegree, item.value]);

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

      const degreesResult = await getDegrees.execute({ name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(degreesResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([degrees]) => {
          setOptions(degrees);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getDegrees, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, degree: Degree | null) => {
      if (degree) {
        setInputValue(degree.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: degree?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((degree) => degree.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? 'No degrees found' : 'Type to search degree'}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
