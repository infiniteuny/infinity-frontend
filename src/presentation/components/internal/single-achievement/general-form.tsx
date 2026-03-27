import { AchievementInput } from './achievement-form';
import {
  Autocomplete,
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetTeams } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Team } from '@app/domain/entities';
import { TeamDto, TeamMapper } from '@app/infrastructure/dtos';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<AchievementInput>;
  teams?: TeamDto[];
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  teams,
}: Props) {
  const getTeams = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);
  const parsedTeams = useMemo(() => teams?.map(TeamMapper.fromDtoToDomain) ?? [], [teams]);

  const [teamInput, setTeamInput] = useState(parsedTeams[0]?.name ?? '');
  const [teamOptions, setTeamOptions] = useState<Team[]>(parsedTeams);
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = teamInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsTeamLoading(true);

      const teamsResult = await getTeams.execute(undefined, { name: query }, { perPage: 10 });

      if (!active) return;

      match(teamsResult, {
        onLeft: () => {
          setTeamOptions([]);
        },
        onRight: ([teams]) => {
          setTeamOptions(teams);
        },
      });

      setIsTeamLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getTeams, teamInput]);

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
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="teamId"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  options={teamOptions}
                  value={teamOptions.find((team) => team.id === field.value) ?? null}
                  onChange={(_, team) => {
                    field.onChange(team?.id ?? '');
                  }}
                  inputValue={teamInput}
                  onInputChange={(_, value) => {
                    setTeamInput(value);

                    if (value.trim().length < 1) {
                      setTeamOptions([]);
                      setIsTeamLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isTeamLoading}
                  noOptionsText={teamInput ? 'No teams found' : 'Type to search team'}
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="teamId"
                      label="Team"
                      fullWidth
                      margin="none"
                      helperText={errors.teamId?.message}
                      error={!!errors.teamId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="status-label" error={!!errors.status}>
                Status
              </InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={'PENDING'}
                render={({ field }) => (
                  <Select labelId="status-label" label="Status" error={!!errors.status} {...field}>
                    <MenuItem key="pending" value="PENDING">
                      Pending
                    </MenuItem>
                    <MenuItem key="rejected" value="REJECTED">
                      Rejected
                    </MenuItem>
                    <MenuItem key="accepted" value="ACCEPTED">
                      Accepted
                    </MenuItem>
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.status}>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('description')}
              id="description"
              label="Description"
              fullWidth
              margin="none"
              multiline
              minRows={3}
              helperText={errors.description?.message}
              error={!!errors.description}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
