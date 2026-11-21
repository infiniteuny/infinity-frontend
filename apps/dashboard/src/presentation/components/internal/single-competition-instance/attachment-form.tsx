import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CompetitionInstanceInput } from './competition-instance-form';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<CompetitionInstanceInput>;
};

export function AttachmentForm({
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
            Attachment
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
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
