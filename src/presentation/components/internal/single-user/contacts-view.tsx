import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function ContactsView({ user }: Props) {
  return (
    <Box component="section" className="w-full px-6 mb-4">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <Toolbar component="header" className="min-h-10 h-auto p-0 mb-4">
          <Typography component="h2" variant="h6" className="font-medium">
            Contacts
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Email Address
            </Typography>
            <Typography variant="body2" component="p">
              {user.emailAddress}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Phone Number
            </Typography>
            <Typography variant="body2" component="p">
              {user.phoneNumber}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
