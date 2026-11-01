import { APP } from '@config';
import { Box, Container, Typography } from '@mui/material';

export default function LandingPage() {
  return (
    <Box
      component="main"
      id="main"
      className="flex min-h-screen flex-col items-center justify-center p-8 text-center"
    >
      <Container maxWidth="md" className="flex flex-col items-center gap-4">
        <Typography variant="h2" className="font-bold">
          {APP.site.title}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          {APP.site.tagline}
        </Typography>
        <Typography variant="body1" color="textSecondary" className="max-w-xl">
          {APP.site.description}
        </Typography>
      </Container>
    </Box>
  );
}
