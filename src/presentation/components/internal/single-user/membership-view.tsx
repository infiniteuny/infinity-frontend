import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function MembershipView({ user }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
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
                  {user.startDate
                    ? DateTime.fromJSDate(user.startDate).toFormat('dd/LL/yyyy')
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" component="p" className="font-medium">
                  End Date
                </Typography>
                <Typography variant="body2" component="p">
                  {user.endDate ? DateTime.fromJSDate(user.endDate).toFormat('dd/LL/yyyy') : 'N/A'}
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
