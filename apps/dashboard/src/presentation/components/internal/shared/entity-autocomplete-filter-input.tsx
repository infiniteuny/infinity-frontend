'use client';

import { Autocomplete, TextField } from '@mui/material';
import { Either, match } from 'effect/Either';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props<T extends { id: string }> = GridFilterInputValueProps & {
  fetchById: (id: string, signal: AbortSignal) => Promise<Either<T, Error>>;
  search: (query: string, signal: AbortSignal) => Promise<Either<[T[], unknown], Error>>;
  getOptionLabel: (option: T) => string;
  emptyText: string;
  noOptionsText: string;
};

export function EntityAutocompleteFilterInput<T extends { id: string }>({
  item,
  applyValue,
  fetchById,
  search,
  getOptionLabel,
  emptyText,
  noOptionsText,
}: Props<T>) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const optionsRef = useRef<T[]>(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!item.value) return;

    const existing = optionsRef.current.find((opt) => opt.id === item.value);
    if (existing) return;

    const controller = new AbortController();

    (async () => {
      try {
        const result = await fetchById(String(item.value), controller.signal);
        if (controller.signal.aborted) return;

        match(result, {
          onLeft: () => {},
          onRight: (entity) => {
            setOptions([entity]);
            setInputValue(getOptionLabel(entity));
          },
        });
      } catch {
        // Ignore aborted or failed lookup
      }
    })();

    return () => {
      controller.abort();
    };
  }, [fetchById, getOptionLabel, item.value]);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 1) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await search(query, controller.signal);
        if (controller.signal.aborted) return;

        match(result, {
          onLeft: () => {
            setOptions([]);
          },
          onRight: ([items]) => {
            setOptions(items);
          },
        });
      } catch {
        if (!controller.signal.aborted) {
          setOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [search, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    if (value.trim().length < 1) {
      setIsLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (_: unknown, entity: T | null) => {
      if (entity) {
        setInputValue(getOptionLabel(entity));
        setSearchQuery('');
        setIsLoading(false);
      }
      applyValue({ ...item, value: entity?.id ?? '' });
    },
    [applyValue, getOptionLabel, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((opt) => opt.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? noOptionsText : emptyText}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
