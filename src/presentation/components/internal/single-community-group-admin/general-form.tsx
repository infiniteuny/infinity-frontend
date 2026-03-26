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
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { CommunityGroupAdminInput } from './community-group-admin-form';
import { Controller, UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<CommunityGroupAdminInput>;
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
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
              {...register('year', { valueAsNumber: true })}
              id="year"
              label="Year"
              fullWidth
              margin="none"
              helperText={errors.year?.message}
              error={!!errors.year}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="legend" error={!!errors.isActive}>
                Active
              </FormLabel>
              <Controller
                name="isActive"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, ...field } }) => (
                  <RadioGroup {...field} row onChange={(e) => onChange(e.target.value === 'true')}>
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors.isActive}>{errors.isActive?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
