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
import { CommunityGroupInput } from './community-group-form';
import { Controller, UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<CommunityGroupInput>;
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
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
              {...register('description')}
              id="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              margin="none"
              helperText={errors.description?.message}
              error={!!errors.description}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('priority', { valueAsNumber: true })}
              id="priority"
              label="Priority"
              type="number"
              fullWidth
              margin="none"
              helperText={errors.priority?.message}
              error={!!errors.priority}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('logo')}
              id="logo"
              label="Logo"
              fullWidth
              margin="none"
              helperText={errors.logo?.message}
              error={!!errors.logo}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting} className="px-3">
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
