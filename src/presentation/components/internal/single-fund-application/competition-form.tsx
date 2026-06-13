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
import { GetCompetitionInstances } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useState } from 'react';
import { FundApplicationInput } from './fund-application-form';
import { DateTime } from 'luxon';
import { DatePicker } from '@mui/x-date-pickers';
import { CompetitionInstance } from '@app/domain/entities';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionScaleDto,
  CompetitionScaleMapper,
} from '@app/infrastructure/dtos';

type Props = {
  methods: UseFormReturn<FundApplicationInput>;
  competitionScales: CompetitionScaleDto[];
  competitionInstances?: CompetitionInstanceDto[];
};

export function CompetitionForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  competitionScales,
  competitionInstances,
}: Props) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );
  const parsedCompetitionScales = useMemo(
    () => competitionScales.map(CompetitionScaleMapper.fromDtoToDomain),
    [competitionScales],
  );
  const parsedCompetitionInstances = useMemo(
    () => competitionInstances?.map(CompetitionInstanceMapper.fromDtoToDomain) ?? [],
    [competitionInstances],
  );

  const [competitionInstanceInput, setCompetitionInstanceInput] = useState(
    parsedCompetitionInstances[0]?.name ?? '',
  );
  const [competitionInstanceOptions, setCompetitionInstanceOptions] = useState<
    CompetitionInstance[]
  >(parsedCompetitionInstances);
  const [isCompetitionInstanceLoading, setIsCompetitionInstanceLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = competitionInstanceInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsCompetitionInstanceLoading(true);

      const competitionInstancesResult = await getCompetitionInstances.execute(
        undefined,
        { name: query },
        undefined,
        { perPage: 10 },
      );

      if (!active) return;

      match(competitionInstancesResult, {
        onLeft: () => {
          setCompetitionInstanceOptions([]);
        },
        onRight: ([competitionInstances]) => {
          setCompetitionInstanceOptions(competitionInstances);
        },
      });

      setIsCompetitionInstanceLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [competitionInstanceInput, getCompetitionInstances]);

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Competition
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              name="competitionInstanceId"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <Autocomplete
                  options={competitionInstanceOptions}
                  value={
                    competitionInstanceOptions.find(
                      (competitionInstance) => competitionInstance.id === field.value,
                    ) ?? null
                  }
                  onChange={(_, competitionInstance) => {
                    field.onChange(competitionInstance?.id ?? '');
                  }}
                  inputValue={competitionInstanceInput}
                  onInputChange={(_, value) => {
                    setCompetitionInstanceInput(value);

                    if (value.trim().length < 1) {
                      setCompetitionInstanceOptions([]);
                      setIsCompetitionInstanceLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isCompetitionInstanceLoading}
                  noOptionsText={
                    competitionInstanceInput
                      ? 'No competition instances found'
                      : 'Type to search competition instance'
                  }
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="competitionInstanceId"
                      label="Name"
                      fullWidth
                      margin="none"
                      helperText={errors.competitionInstanceId?.message}
                      error={!!errors.competitionInstanceId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
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
          <Grid size={12}>
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
          <Grid size={12}>
            <Controller
              name="competitionStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={isSubmitting}
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
          <Grid size={12}>
            <Controller
              name="competitionEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={isSubmitting}
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
