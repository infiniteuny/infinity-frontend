import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { ProjectGalleryInput } from './project-gallery-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<ProjectGalleryInput>;
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
              {...register('title')}
              id="title"
              label="Title"
              fullWidth
              margin="none"
              helperText={errors.title?.message}
              error={!!errors.title}
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
              label="Project URL"
              fullWidth
              margin="none"
              type="url"
              helperText={errors.url?.message}
              error={!!errors.url}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FileDropzoneField
              name="image"
              control={control}
              id="image"
              label="Image"
              accept="image/png,image/jpeg,image/webp"
              helperText="Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.image?.message}
              previewType="image"
              previewAlt="Selected image preview"
              currentFileLabel="Current image"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
