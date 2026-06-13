import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetDegrees } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Degree } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function DegreeFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getDegrees = useMemo(() => clientContainer.get<GetDegrees>(SYMBOLS.GetDegrees), []);

  const [degreeInput, setDegreeInput] = useState('');
  const [degreeOptions, setDegreeOptions] = useState<Degree[]>([]);
  const [isDegreeLoading, setIsDegreeLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = degreeInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsDegreeLoading(true);

      const degreesResult = await getDegrees.execute({ name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(degreesResult, {
        onLeft: () => {
          setDegreeOptions([]);
        },
        onRight: ([degrees]) => {
          setDegreeOptions(degrees);
        },
      });

      setIsDegreeLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getDegrees, degreeInput]);

  return (
    <Autocomplete
      options={degreeOptions}
      value={degreeOptions.find((degree) => degree.id === item.value) ?? null}
      onChange={(_, degree) => {
        applyValue({ ...item, value: degree?.id ?? '' });
      }}
      inputValue={degreeInput}
      onInputChange={(_, value) => {
        setDegreeInput(value);

        if (value.trim().length < 1) {
          setDegreeOptions([]);
          setIsDegreeLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isDegreeLoading}
      noOptionsText={degreeInput ? 'No degrees found' : 'Type to search degree'}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
