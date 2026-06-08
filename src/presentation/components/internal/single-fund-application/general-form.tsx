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
import { FundApplicationInput } from './fund-application-form';
import { GetTeams } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Team } from '@app/domain/entities';
import { TeamDto, TeamMapper } from '@app/infrastructure/dtos';
import { useEffect, useMemo, useState } from 'react';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  methods: UseFormReturn<FundApplicationInput>;
  teams?: TeamDto[];
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
  teams,
}: Props) {
  const getTeams = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);
  const parsedTeams = useMemo(() => teams?.map(TeamMapper.fromDtoToDomain) ?? [], [teams]);
  const userPermissions = useInternalStore((s) => s.session?.permissions || []);

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
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
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
          {userPermissions.includes('approve-fund-application') ? (
            <Grid size={12}>
              <FormControl fullWidth margin="none" disabled={isSubmitting}>
                <InputLabel id="status-label" error={!!errors.status}>
                  Status
                </InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={'PENDING'}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="status-label"
                      label="Status"
                      error={!!errors.status}
                    >
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
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
