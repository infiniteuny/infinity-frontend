'use client';

import { Either, match } from 'effect/Either';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

type Props<T extends { id: string }> = GridFilterInputValueProps & {
  labelId: string;
  fetchOptions: (signal: AbortSignal) => Promise<Either<[T[], unknown], Error>>;
  getOptionLabel: (option: T) => string;
  errorContext: string;
};

export function EntitySelectFilterInput<T extends { id: string }>({
  item,
  applyValue,
  labelId,
  fetchOptions,
  getOptionLabel,
  errorContext,
}: Props<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const result = await fetchOptions(controller.signal);
        if (controller.signal.aborted) return;

        const data = match(result, {
          onLeft: (error) => {
            console.error(`Failed to fetch ${errorContext}:`, error);
            return [];
          },
          onRight: ([items]) => items,
        });

        setOptions(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(`Failed to fetch ${errorContext}:`, error);
          setOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [errorContext, fetchOptions]);

  const handleFilterChange = useCallback(
    (event: SelectChangeEvent) => {
      applyValue({ ...item, value: event.target.value });
    },
    [applyValue, item],
  );

  return (
    <FormControl fullWidth margin="none" disabled={loading}>
      <InputLabel size="small" id={labelId}>
        Value
      </InputLabel>
      <Select
        label="Value"
        labelId={labelId}
        size="small"
        fullWidth
        value={item.value || ''}
        onChange={handleFilterChange}
        disabled={loading}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
