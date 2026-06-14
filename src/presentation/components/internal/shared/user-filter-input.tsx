import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetUser, GetUsers } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function UserFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getUsers = useMemo(() => clientContainer.get<GetUsers>(SYMBOLS.GetUsers), []);
  const getUser = useMemo(() => clientContainer.get<GetUser>(SYMBOLS.GetUser), []);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item.value) return;

    let active = true;

    (async () => {
      const result = await getUser.execute(String(item.value));

      if (!active) return;

      match(result, {
        onLeft: () => {},
        onRight: (user) => {
          setOptions([user]);
          setInputValue(user.name);
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [getUser, item.value]);

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

      const usersResult = await getUsers.execute(undefined, { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(usersResult, {
        onLeft: () => {
          setOptions([]);
        },
        onRight: ([users]) => {
          setOptions(users);
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getUsers, searchQuery]);

  const handleInputChange = useCallback((_: unknown, value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  }, []);

  const handleChange = useCallback(
    (_: unknown, user: User | null) => {
      if (user) {
        setInputValue(user.name);
        setSearchQuery('');
      }
      applyValue({ ...item, value: user?.id ?? '' });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      options={options}
      value={options.find((user) => user.id === item.value) ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText={searchQuery ? 'No users found' : 'Type to search user'}
      filterOptions={(opts) => opts}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
