import { Container, Typography } from '@mui/material';

export function AuthFooter() {
  return (
    <Container
      component="footer"
      maxWidth={false}
      sx={{
        bgcolor: {
          xs: 'surface.main',
          sm: 'surfaceContainer.main',
        },
      }}
      className="flex items-center h-16 w-auto px-6 py-2 md:px-12 lg:px-18"
    >
      <Typography
        component="p"
        sx={{ color: 'outline' }}
        className="max-w-2xl mx-auto my-0 text-sm text-center"
      >
        &copy; {new Date().getFullYear()}. Made with &#128154; by INFINITE UNY.
      </Typography>
    </Container>
  );
}
