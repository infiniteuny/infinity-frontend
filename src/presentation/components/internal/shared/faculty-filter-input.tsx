import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetFaculties } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Faculty } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function FacultyFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getFaculties = useMemo(() => clientContainer.get<GetFaculties>(SYMBOLS.GetFaculties), []);

  const [facultyInput, setFacultyInput] = useState('');
  const [facultyOptions, setFacultyOptions] = useState<Faculty[]>([]);
  const [isFacultyLoading, setIsFacultyLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = facultyInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsFacultyLoading(true);

      const facultiesResult = await getFaculties.execute({ name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(facultiesResult, {
        onLeft: () => {
          setFacultyOptions([]);
        },
        onRight: ([faculties]) => {
          setFacultyOptions(faculties);
        },
      });

      setIsFacultyLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getFaculties, facultyInput]);

  return (
    <Autocomplete
      options={facultyOptions}
      value={facultyOptions.find((faculty) => faculty.id === item.value) ?? null}
      onChange={(_, faculty) => {
        applyValue({ ...item, value: faculty?.id ?? '' });
      }}
      inputValue={facultyInput}
      onInputChange={(_, value) => {
        setFacultyInput(value);

        if (value.trim().length < 1) {
          setFacultyOptions([]);
          setIsFacultyLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isFacultyLoading}
      noOptionsText={facultyInput ? 'No faculties found' : 'Type to search faculty'}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
