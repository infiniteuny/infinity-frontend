import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function ContactsView({ user }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Contacts
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
                Email Address
              </Typography>
              <Typography variant="body2" component="p">
                {user.emailAddress}
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
                Phone Number
              </Typography>
              <Typography variant="body2" component="p">
                {user.phoneNumber}
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
