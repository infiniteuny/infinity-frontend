import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Toolbar,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, UseFormReturn } from 'react-hook-form';
import { UserInput } from './user-form';
import { DateTime } from 'luxon';

type Props = {
  methods: UseFormReturn<UserInput>;
};

export function MembershipForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Membership
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              name="startDate"
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
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message,
                      onBlur: field.onBlur,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting} className="px-3">
              <FormLabel component="legend" className="mb-1">
                Extraordinary Member
              </FormLabel>
              <Controller
                name="isExtraordinary"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, ...field } }) => (
                  <RadioGroup {...field} row onChange={(e) => onChange(e.target.value === 'true')}>
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors.isExtraordinary}>
                {errors.isExtraordinary?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
