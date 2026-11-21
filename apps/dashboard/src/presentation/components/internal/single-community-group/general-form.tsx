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
import { FileDropzoneField } from '@app/presentation/components/internal/shared';

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
          <Grid size={12}>
            <FileDropzoneField
              name="logo"
              control={control}
              id="logo"
              label="Logo"
              accept="image/png,image/jpeg,image/webp"
              helperText="Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.logo?.message}
              previewType="image"
              previewAlt="Selected logo preview"
              currentFileLabel="Current logo"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
