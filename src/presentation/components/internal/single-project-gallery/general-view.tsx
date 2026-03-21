import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ProjectGallery } from '@app/domain/entities';

type Props = {
  projectGallery: ProjectGallery;
};

export function GeneralView({ projectGallery }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Title
            </Typography>
            <Typography variant="body2" component="p">
              {projectGallery.title}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Description
            </Typography>
            <Typography variant="body2" component="p">
              {projectGallery.description}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              URL
            </Typography>
            <Typography variant="body2" component="p">
              {projectGallery.url}
            </Typography>
          </Grid>
          <Grid size={12}>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
