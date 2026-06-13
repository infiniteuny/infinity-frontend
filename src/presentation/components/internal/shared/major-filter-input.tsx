import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetMajors } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Major } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function MajorFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getMajors = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);

  const [majorInput, setMajorInput] = useState('');
  const [majorOptions, setMajorOptions] = useState<Major[]>([]);
  const [isMajorLoading, setIsMajorLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = majorInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsMajorLoading(true);

      const majorsResult = await getMajors.execute(undefined, { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(majorsResult, {
        onLeft: () => {
          setMajorOptions([]);
        },
        onRight: ([majors]) => {
          setMajorOptions(majors);
        },
      });

      setIsMajorLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getMajors, majorInput]);

  return (
    <Autocomplete
      options={majorOptions}
      value={majorOptions.find((major) => major.id === item.value) ?? null}
      onChange={(_, major) => {
        applyValue({ ...item, value: major?.id ?? '' });
      }}
      inputValue={majorInput}
      onInputChange={(_, value) => {
        setMajorInput(value);

        if (value.trim().length < 1) {
          setMajorOptions([]);
          setIsMajorLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isMajorLoading}
      noOptionsText={majorInput ? 'No majors found' : 'Type to search major'}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
