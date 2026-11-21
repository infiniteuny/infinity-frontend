import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { FundApplicationInput } from './fund-application-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<FundApplicationInput>;
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
              name="letterOfAcceptance"
              control={control}
              id="letter-of-acceptance"
              label="Letter of Acceptance"
              accept="application/pdf"
              helperText="Allowed file type: PDF. Allowed size: up to 20MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.letterOfAcceptance?.message}
              previewType="pdf"
              previewTitle="Letter of Acceptance Preview"
              currentFileLabel="Current document"
            />
          </Grid>
          <Grid size={12}>
            <FileDropzoneField
              name="proposal"
              control={control}
              id="proposal"
              label="Proposal"
              accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              helperText="Allowed file type: DOC, DOCX. Allowed size: up to 20MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.proposal?.message}
              previewType="file"
              currentFileLabel="Current document"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
