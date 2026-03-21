import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Testimonial } from '@app/domain/entities';

type Props = {
  testimonial: Testimonial;
};

export function GeneralView({ testimonial }: Props) {
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
              Name
            </Typography>
            <Typography variant="body2" component="p">
              {testimonial.name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Position
            </Typography>
            <Typography variant="body2" component="p">
              {testimonial.position}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Content
            </Typography>
            <Typography variant="body2" component="p">
              {testimonial.content}
            </Typography>
          </Grid>
          <Grid size={12}>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
