import { Box, Container, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';
import { FundApplication } from '@app/domain/entities';
import { PdfViewer } from '@app/presentation/components/internal/shared';
import Link from 'next/link';

type Props = {
  fundApplication: FundApplication;
};

export function DocumentsView({ fundApplication }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Letter of Acceptance
            </Typography>
            <Box
              sx={{ borderColor: 'outline' }}
              className="mt-2 w-full rounded-lg border border-solid p-4"
            >
              <Box className="flex flex-row items-center justify-between gap-2">
                <Typography variant="body2" color="onSurfaceVariant.main" className="font-semibold">
                  Letter of Acceptance
                </Typography>
                <Stack direction="row" spacing={1}>
                  {typeof fundApplication.letterOfAcceptance === 'string' ? (
                    <>
                      <IconButton
                        component="a"
                        LinkComponent={Link}
                        href={fundApplication.letterOfAcceptance}
                        download="letter_of_acceptance.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download letter of acceptance"
                        title="Download"
                      >
                        <DownloadRounded fontSize="small" />
                      </IconButton>
                    </>
                  ) : null}
                </Stack>
              </Box>
            </Box>
            <PdfViewer
              file={fundApplication.letterOfAcceptance}
              title="Letter of Acceptance"
              height={500}
              className="mt-2"
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Proposal
            </Typography>
            <Box
              sx={{ borderColor: 'outline' }}
              className="mt-2 w-full rounded-lg border border-solid p-4"
            >
              <Box className="flex flex-row items-center justify-between gap-2">
                <Typography variant="body2" color="onSurfaceVariant.main" className="font-semibold">
                  Proposal
                </Typography>
                <Stack direction="row" spacing={1}>
                  {typeof fundApplication.proposal === 'string' ? (
                    <IconButton
                      component="a"
                      href={fundApplication.proposal}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open proposal in new tab"
                      title="Open in new tab"
                    >
                      <DownloadRounded fontSize="small" />
                    </IconButton>
                  ) : null}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
