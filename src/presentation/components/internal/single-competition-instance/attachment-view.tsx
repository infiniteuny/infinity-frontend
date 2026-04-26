import { CompetitionInstance } from '@app/domain/entities';
import { Box, Container, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';
import Link from 'next/link';

type Props = {
  competitionInstance: CompetitionInstance;
};

export function AttachmentView({ competitionInstance }: Props) {
  const hasLogo = typeof competitionInstance.logo === 'string' && competitionInstance.logo;

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Attachment
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-2xl p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Logo
              </Typography>
              {hasLogo ? (
                <>
                  <Box
                    sx={{ borderColor: 'outline' }}
                    className="mt-2 w-full rounded-lg border border-solid p-4"
                  >
                    <Box className="flex flex-row items-center justify-between gap-2">
                      <Typography
                        variant="body2"
                        color="onSurfaceVariant.main"
                        className="font-semibold"
                      >
                        Logo
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          component="a"
                          LinkComponent={Link}
                          href={competitionInstance.logo as string}
                          download="logo.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download logo"
                          title="Download"
                        >
                          <DownloadRounded fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Box>
                  <Box
                    component="img"
                    src={competitionInstance.logo as string}
                    alt={competitionInstance.name}
                    sx={{
                      width: '100%',
                      maxHeight: 280,
                      objectFit: 'contain',
                    }}
                    className="mt-2"
                  />
                </>
              ) : (
                <Typography variant="body2" color="onSurfaceVariant.main" className="mt-2 italic">
                  No logo uploaded
                </Typography>
              )}
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
