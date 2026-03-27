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
import { Competition } from '@app/domain/entities';
import {
  CompetitionDto,
  CompetitionMapper,
  CompetitionOutputDto,
  CompetitionOutputMapper,
  CompetitionRankDto,
  CompetitionRankMapper,
  CompetitionScaleDto,
  CompetitionScaleMapper,
  CompetitionTimeRangeDto,
  CompetitionTimeRangeMapper,
} from '@app/infrastructure/dtos';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { GetCompetitions } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<AchievementInput>;
  competitionScales: CompetitionScaleDto[];
  competitionTimeRanges: CompetitionTimeRangeDto[];
  competitionOutputs: CompetitionOutputDto[];
  competitionRanks: CompetitionRankDto[];
  competitions?: CompetitionDto[];
};

export function CompetitionForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  competitionScales,
  competitionTimeRanges,
  competitionOutputs,
  competitionRanks,
  competitions,
}: Props) {
  const getCompetitions = useMemo(
    () => clientContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions),
    [],
  );
  const parsedCompetitionScales = useMemo(
    () => competitionScales.map(CompetitionScaleMapper.fromDtoToDomain),
    [competitionScales],
  );
  const parsedCompetitionTimeRanges = useMemo(
    () => competitionTimeRanges.map(CompetitionTimeRangeMapper.fromDtoToDomain),
    [competitionTimeRanges],
  );
  const parsedCompetitionOutputs = useMemo(
    () => competitionOutputs.map(CompetitionOutputMapper.fromDtoToDomain),
    [competitionOutputs],
  );
  const parsedCompetitionRanks = useMemo(
    () => competitionRanks.map(CompetitionRankMapper.fromDtoToDomain),
    [competitionRanks],
  );
  const parsedCompetitions = useMemo(
    () => competitions?.map(CompetitionMapper.fromDtoToDomain) ?? [],
    [competitions],
  );

  const [competitionInput, setCompetitionInput] = useState(parsedCompetitions[0]?.name ?? '');
  const [competitionOptions, setCompetitionOptions] = useState<Competition[]>(parsedCompetitions);
  const [isCompetitionLoading, setIsCompetitionLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = competitionInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsCompetitionLoading(true);

      const competitionsResult = await getCompetitions.execute(
        undefined,
        { name: query },
        { perPage: 10 },
      );

      if (!active) return;

      match(competitionsResult, {
        onLeft: () => {
          setCompetitionOptions([]);
        },
        onRight: ([competitions]) => {
          setCompetitionOptions(competitions);
        },
      });

      setIsCompetitionLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [competitionInput, getCompetitions]);

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Competition
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="competitionId"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  options={competitionOptions}
                  value={
                    competitionOptions.find((competition) => competition.id === field.value) ?? null
                  }
                  onChange={(_, competition) => {
                    field.onChange(competition?.id ?? '');
                  }}
                  inputValue={competitionInput}
                  onInputChange={(_, value) => {
                    setCompetitionInput(value);

                    if (value.trim().length < 1) {
                      setCompetitionOptions([]);
                      setIsCompetitionLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isCompetitionLoading}
                  noOptionsText={
                    competitionInput ? 'No competitions found' : 'Type to search competition'
                  }
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="competitionId"
                      label="Name"
                      fullWidth
                      margin="none"
                      helperText={errors.competitionId?.message}
                      error={!!errors.competitionId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register('competitionBranch')}
              id="competitionBranch"
              label="Competition Branch"
              fullWidth
              margin="none"
              helperText={errors.competitionBranch?.message}
              error={!!errors.competitionBranch}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="competitionScaleId-label" error={!!errors.competitionScaleId}>
                Competition Scale
              </InputLabel>
              <Controller
                name="competitionScaleId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="competitionScaleId-label"
                    label="Competition Scale"
                    error={!!errors.competitionScaleId}
                  >
                    <MenuItem key="empty" value="" disabled sx={{ display: 'none' }}>
                      Select competition scale
                    </MenuItem>
                    {parsedCompetitionScales.map((competitionScale) => (
                      <MenuItem key={competitionScale.id} value={competitionScale.id}>
                        {competitionScale.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.competitionScaleId}>
                {errors.competitionScaleId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="competitionTimeRangeId-label" error={!!errors.competitionTimeRangeId}>
                Competition Time Range
              </InputLabel>
              <Controller
                name="competitionTimeRangeId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="competitionTimeRangeId-label"
                    label="Competition Time Range"
                    error={!!errors.competitionTimeRangeId}
                  >
                    <MenuItem key="empty" value="" disabled sx={{ display: 'none' }}>
                      Select competition time range
                    </MenuItem>
                    {parsedCompetitionTimeRanges.map((competitionTimeRange) => (
                      <MenuItem key={competitionTimeRange.id} value={competitionTimeRange.id}>
                        {competitionTimeRange.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.competitionTimeRangeId}>
                {errors.competitionTimeRangeId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="competitionOutputId-label" error={!!errors.competitionOutputId}>
                Competition Output
              </InputLabel>
              <Controller
                name="competitionOutputId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="competitionOutputId-label"
                    label="Competition Output"
                    error={!!errors.competitionOutputId}
                  >
                    <MenuItem key="empty" value="" disabled sx={{ display: 'none' }}>
                      Select competition output
                    </MenuItem>
                    {parsedCompetitionOutputs.map((competitionOutput) => (
                      <MenuItem key={competitionOutput.id} value={competitionOutput.id}>
                        {competitionOutput.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.competitionOutputId}>
                {errors.competitionOutputId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="competitionRankId-label" error={!!errors.competitionRankId}>
                Competition Rank
              </InputLabel>
              <Controller
                name="competitionRankId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="competitionRankId-label"
                    label="Competition Rank"
                    error={!!errors.competitionRankId}
                  >
                    <MenuItem key="empty" value="" disabled sx={{ display: 'none' }}>
                      Select competition rank
                    </MenuItem>
                    {parsedCompetitionRanks.map((competitionRank) => (
                      <MenuItem key={competitionRank.id} value={competitionRank.id}>
                        {competitionRank.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.competitionRankId}>
                {errors.competitionRankId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="competitionStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={isSubmitting}
                  label="Competition Start Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date ? date.toJSDate() : null)}
                  onAccept={field.onBlur}
                  inputRef={field.ref}
                  slotProps={{
                    field: {
                      clearable: false,
                    },
                    textField: {
                      fullWidth: true,
                      error: !!errors.competitionStartDate,
                      helperText: errors.competitionStartDate?.message,
                      onBlur: field.onBlur,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="competitionEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={isSubmitting}
                  label="Competition End Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date ? date.toJSDate() : null)}
                  onAccept={field.onBlur}
                  inputRef={field.ref}
                  slotProps={{
                    field: {
                      clearable: false,
                    },
                    textField: {
                      fullWidth: true,
                      error: !!errors.competitionEndDate,
                      helperText: errors.competitionEndDate?.message,
                      onBlur: field.onBlur,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
