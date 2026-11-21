import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { TestimonialInput } from './testimonial-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<TestimonialInput>;
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
              {...register('position')}
              id="position"
              label="Position"
              fullWidth
              margin="none"
              helperText={errors.position?.message}
              error={!!errors.position}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('content')}
              id="content"
              label="Content"
              fullWidth
              margin="none"
              multiline
              minRows={4}
              helperText={errors.content?.message}
              error={!!errors.content}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FileDropzoneField
              name="photo"
              control={control}
              id="photo"
              label="Photo"
              accept="image/png,image/jpeg,image/webp"
              helperText="Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.photo?.message}
              previewType="image"
              previewAlt="Selected photo preview"
              currentFileLabel="Current photo"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
