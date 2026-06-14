import {
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
import { CompetitionInstanceInput } from './competition-instance-form';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

type Props = {
  methods: UseFormReturn<CompetitionInstanceInput>;
  competitionOrganizerTypes: CompetitionOrganizerTypeDto[];
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  competitionOrganizerTypes,
}: Props) {
  const parsedCompetitionOrganizerTypes = useMemo(
    () => competitionOrganizerTypes.map(CompetitionOrganizerTypeMapper.fromDtoToDomain),
    [competitionOrganizerTypes],
  );

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <input type="hidden" {...register('competitionId')} />
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
            <TextField
              {...register('shortname')}
              id="shortname"
              label="Shortname"
              fullWidth
              margin="none"
              helperText={errors.shortname?.message}
              error={!!errors.shortname}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('description')}
              id="description"
              label="Description"
              fullWidth
              margin="none"
              multiline
              minRows={4}
              helperText={errors.description?.message}
              error={!!errors.description}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('url')}
              id="url"
              label="URL"
              fullWidth
              margin="none"
              helperText={errors.url?.message}
              error={!!errors.url}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('organizer')}
              id="organizer"
              label="Organizer"
              fullWidth
              margin="none"
              helperText={errors.organizer?.message}
              error={!!errors.organizer}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="organizerTypeId-label" error={!!errors.organizerTypeId}>
                Organizer Type
              </InputLabel>
              <Controller
                name="organizerTypeId"
                control={control}
                defaultValue={'0'}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="organizerTypeId-label"
                    label="Organizer Type"
                    error={!!errors.organizerTypeId}
                  >
                    <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                      Select organizer type
                    </MenuItem>
                    {parsedCompetitionOrganizerTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.organizerTypeId}>
                {errors.organizerTypeId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('location')}
              id="location"
              label="Location"
              fullWidth
              margin="none"
              helperText={errors.location?.message}
              error={!!errors.location}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date?.toJSDate())}
                  onAccept={field.onBlur}
                  disabled={isSubmitting}
                  inputRef={field.ref}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'none',
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message,
                      onBlur: field.onBlur,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End Date"
                  format="dd/LL/yyyy"
                  timezone="UTC"
                  value={field.value ? DateTime.fromJSDate(field.value, { zone: 'UTC' }) : null}
                  onChange={(date) => field.onChange(date?.toJSDate())}
                  onAccept={field.onBlur}
                  disabled={isSubmitting}
                  inputRef={field.ref}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'none',
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message,
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
