import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { User } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';

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
            <ViewTile title="Email Address" subtitle={user.emailAddress} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Phone Number" subtitle={user.phoneNumber} position="bottom" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
