import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { PersonaInput } from './persona-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<PersonaInput>;
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
