import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Testimonial } from '@app/domain/entities';

type Props = {
  testimonial: Testimonial;
};

export function GeneralView({ testimonial }: Props) {
  return (
    <Box component="section" className="mb-6 w-full px-6">
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
                Name
              </Typography>
              <Typography variant="body2" component="p">
                {testimonial.name}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Position
              </Typography>
              <Typography variant="body2" component="p">
                {testimonial.position}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Content
              </Typography>
              <Typography variant="body2" component="p">
                {testimonial.content}
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
                Photo
              </Typography>
              <Box
                component="img"
                src={testimonial.photo as string}
                alt={testimonial.name}
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
