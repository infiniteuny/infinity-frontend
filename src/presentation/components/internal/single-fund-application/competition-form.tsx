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
import { GetCompetitions } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useState } from 'react';
import { FundApplicationInput } from './fund-application-form';
import { DateTime } from 'luxon';
import { DatePicker } from '@mui/x-date-pickers';
import { Competition } from '@app/domain/entities';
import {
  CompetitionDto,
  CompetitionMapper,
  CompetitionScaleDto,
  CompetitionScaleMapper,
} from '@app/infrastructure/dtos';

type Props = {
  methods: UseFormReturn<FundApplicationInput>;
  competitionScales: CompetitionScaleDto[];
  competitions?: CompetitionDto[];
};

export function CompetitionForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  competitionScales,
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
          <Grid size={12}>
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
              label="Branch"
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
                Scale
              </InputLabel>
              <Controller
                name="competitionScaleId"
                control={control}
                defaultValue={'0'}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="competitionScaleId-label"
                    label="Scale"
                    error={!!errors.competitionScaleId}
                  >
                    <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                      Select scale
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
            <Controller
              name="competitionStartDate"
              control={control}
              disabled={isSubmitting}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date ? date.toJSDate() : null)}
                  onAccept={field.onBlur}
                  inputRef={field.ref}
                  slotProps={{
                    field: {
                      clearable: true,
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
              disabled={isSubmitting}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date ? date.toJSDate() : null)}
                  onAccept={field.onBlur}
                  inputRef={field.ref}
                  slotProps={{
                    field: {
                      clearable: true,
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
