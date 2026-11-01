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
      className="flex h-16 w-auto items-center px-6 py-2 md:px-12 lg:px-18"
    >
      <Typography
        component="p"
        sx={{ color: 'outline' }}
        className="mx-auto my-0 max-w-2xl text-center text-sm"
      >
        &copy; {new Date().getFullYear()}. Made with &#128154; by INFINITE UNY.
      </Typography>
    </Container>
  );
}
