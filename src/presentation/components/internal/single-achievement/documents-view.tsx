import { Achievement } from '@app/domain/entities';
import { Box, Container, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';
import Link from 'next/link';

type Props = {
  achievement: Achievement;
};

export function DocumentsView({ achievement }: Props) {
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
              Image
            </Typography>
            <Box
              sx={{ borderColor: 'outline' }}
              className="mt-2 w-full rounded-lg border border-solid p-4"
            >
              <Box className="flex flex-row items-center justify-between gap-2">
                <Typography variant="body2" color="onSurfaceVariant.main" className="font-semibold">
                  Image
                </Typography>
                <Stack direction="row" spacing={1}>
                  {typeof achievement.image === 'string' ? (
                    <>
                      <IconButton
                        component="a"
                        LinkComponent={Link}
                        href={achievement.image}
                        download="image.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download image"
                        title="Download"
                      >
                        <DownloadRounded fontSize="small" />
                      </IconButton>
                    </>
                  ) : null}
                </Stack>
              </Box>
            </Box>
            <Box
              component="img"
              src={achievement.image as string}
              alt={`${achievement.competition?.name} ${achievement.competitionBranch}`}
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'contain',
              }}
              className="mt-2"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
