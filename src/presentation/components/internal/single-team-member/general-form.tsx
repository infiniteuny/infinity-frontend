import { TeamMemberInput } from './team-member-form';
import { Autocomplete, Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetUsers } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<TeamMemberInput>;
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
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

      const usersResult = await getUsers.execute(undefined, { name: query }, { perPage: 100 });

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
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={userOptions}
                  value={userOptions.find((user) => user.id === field.value) ?? null}
                  onChange={(_, user) => {
                    field.onChange(user?.id ?? '');
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
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="userId"
                      label="User"
                      fullWidth
                      margin="none"
                      helperText={errors.userId?.message}
                      error={!!errors.userId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
