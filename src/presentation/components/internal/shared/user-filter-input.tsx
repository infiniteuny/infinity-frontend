import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetUsers } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function UserFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getUsers = useMemo(() => clientContainer.get<GetUsers>(SYMBOLS.GetUsers), []);

  const [userInput, setUserInput] = useState('');
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = userInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsUserLoading(true);

      const usersResult = await getUsers.execute(undefined, { name: query }, undefined, {
        perPage: 10,
      });

      if (!active) return;

      match(usersResult, {
        onLeft: () => {
          setUserOptions([]);
        },
        onRight: ([users]) => {
          setUserOptions(users);
        },
      });

      setIsUserLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getUsers, userInput]);

  return (
    <Autocomplete
      options={userOptions}
      value={userOptions.find((user) => user.id === item.value) ?? null}
      onChange={(_, user) => {
        applyValue({ ...item, value: user?.id ?? '' });
      }}
      inputValue={userInput}
      onInputChange={(_, value) => {
        setUserInput(value);

        if (value.trim().length < 1) {
          setUserOptions([]);
          setIsUserLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isUserLoading}
      noOptionsText={userInput ? 'No users found' : 'Type to search user'}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
