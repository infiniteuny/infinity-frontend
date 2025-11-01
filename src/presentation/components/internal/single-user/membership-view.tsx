import { User } from '@app/domain/entities';
import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';

type Props = {
  user: User;
};

export function MembershipView({ user }: Props) {
  return (
    <Box component="section" className="w-full px-6 mb-4">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <Toolbar component="header" className="min-h-10 h-auto p-0 mb-4">
          <Typography component="h2" variant="h6" className="font-medium">
            Membership
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Active Member
            </Typography>
            <Typography variant="body2" component="p">
              {user.isActive ? 'Yes' : 'No'}
            </Typography>
          </Grid>
          {user.isActive ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" component="p" className="font-medium">
                  Start Date
                </Typography>
                <Typography variant="body2" component="p">
                  {user.startDate?.toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" component="p" className="font-medium">
                  End Date
                </Typography>
                <Typography variant="body2" component="p">
                  {user.endDate ? user.endDate.toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
            </>
          ) : null}
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Extraordinary Member
            </Typography>
            <Typography variant="body2" component="p">
              {user.isExtraordinary ? 'Yes' : 'No'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
