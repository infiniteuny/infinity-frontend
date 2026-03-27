import {
  Autocomplete,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TeamInput } from './team-form';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { useEffect, useMemo, useState } from 'react';
import { clientContainer } from '@app/client-injection';
import { GetUsers } from '@app/application';
import { SYMBOLS } from '@config/symbols';
import { User } from '@app/domain/entities';
import { match } from 'effect/Either';

type Props = {
  methods: UseFormReturn<TeamInput>;
  teamTypes: CompetitionTeamTypeDto[];
  users?: UserDto[];
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  teamTypes,
  users,
}: Props) {
  const getUsers = useMemo(() => clientContainer.get<GetUsers>(SYMBOLS.GetUsers), []);
  const parsedTeamTypes = useMemo(
    () => teamTypes.map(CompetitionTeamTypeMapper.fromDtoToDomain),
    [teamTypes],
  );
  const parsedUsers = useMemo(() => users?.map(UserMapper.fromDtoToDomain) ?? [], [users]);

  const [leaderInput, setLeaderInput] = useState(parsedUsers[0]?.name ?? '');
  const [leaderOptions, setLeaderOptions] = useState<User[]>(parsedUsers);
  const [isLeaderLoading, setIsLeaderLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = leaderInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsLeaderLoading(true);

      const usersResult = await getUsers.execute(undefined, { name: query }, { perPage: 10 });

      if (!active) return;

      match(usersResult, {
        onLeft: () => {
          setLeaderOptions([]);
        },
        onRight: ([users]) => {
          setLeaderOptions(users);
        },
      });

      setIsLeaderLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getUsers, leaderInput]);

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              {...register('name')}
              id="name"
              label="Name"
              fullWidth
              margin="none"
              helperText={errors.name?.message}
              error={!!errors.name}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="leaderId"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  options={leaderOptions}
                  value={leaderOptions.find((user) => user.id === field.value) ?? null}
                  onChange={(_, user) => {
                    field.onChange(user?.id ?? '');
                  }}
                  inputValue={leaderInput}
                  onInputChange={(_, value) => {
                    setLeaderInput(value);

                    if (value.trim().length < 1) {
                      setLeaderOptions([]);
                      setIsLeaderLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isLeaderLoading}
                  noOptionsText={leaderInput ? 'No users found' : 'Type to search user'}
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="leaderId"
                      label="Leader"
                      fullWidth
                      margin="none"
                      helperText={errors.leaderId?.message}
                      error={!!errors.leaderId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="teamTypeId-label" error={!!errors.teamTypeId}>
                Team Type
              </InputLabel>
              <Controller
                name="teamTypeId"
                control={control}
                defaultValue={'0'}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="teamTypeId-label"
                    label="teamTypeId"
                    error={!!errors.teamTypeId}
                  >
                    <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                      Select team type
                    </MenuItem>
                    {parsedTeamTypes.map((teamType) => (
                      <MenuItem key={teamType.id} value={teamType.id}>
                        {teamType.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.teamTypeId}>
                {errors.teamTypeId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="legend" error={!!errors.isPersonal}>
                Personal Team
              </FormLabel>
              <Controller
                name="isPersonal"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, ...field } }) => (
                  <RadioGroup {...field} row onChange={(e) => onChange(e.target.value === 'true')}>
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors.isPersonal}>
                {errors.isPersonal?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
