import { AchievementInput } from './achievement-form';
import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<AchievementInput>;
};

export function DocumentsForm({
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
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
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
