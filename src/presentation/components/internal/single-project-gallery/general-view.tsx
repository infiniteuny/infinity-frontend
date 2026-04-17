import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ProjectGallery } from '@app/domain/entities';

type Props = {
  projectGallery: ProjectGallery;
};

export function GeneralView({ projectGallery }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-t-2xl rounded-b-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Title
              </Typography>
              <Typography variant="body2" component="p">
                {projectGallery.title}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-b-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Description
              </Typography>
              <Typography variant="body2" component="p">
                {projectGallery.description}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-b-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                URL
              </Typography>
              <Typography variant="body2" component="p">
                {projectGallery.url}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-t-md rounded-b-2xl p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Image
              </Typography>
              <Box
                component="img"
                src={projectGallery.image as string}
                alt={projectGallery.title}
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'contain',
                }}
              />
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
