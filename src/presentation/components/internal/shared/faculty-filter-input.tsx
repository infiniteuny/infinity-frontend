import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetFaculties, GetFaculty } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Faculty } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function FacultyFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getFaculties = useMemo(() => clientContainer.get<GetFaculties>(SYMBOLS.GetFaculties), []);
  const getFaculty = useMemo(() => clientContainer.get<GetFaculty>(SYMBOLS.GetFaculty), []);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getFaculty.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (faculty) => {
          setOptions([faculty]);
          setInputValue(faculty.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getFaculty, item.value]);

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

      const facultiesResult = await getFaculties.execute({ name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(facultiesResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([faculties]) => {
          setOptions(faculties);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getFaculties, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, faculty: Faculty | null) => {
      if (faculty) {
        setInputValue(faculty.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: faculty?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((faculty) => faculty.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? 'No faculties found' : 'Type to search faculty'}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
