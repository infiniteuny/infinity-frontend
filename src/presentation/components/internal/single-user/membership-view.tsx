import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function MembershipView({ user }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Membership
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
                Active Member
              </Typography>
              <Typography variant="body2" component="p">
                {user.isActive ? 'Yes' : 'No'}
              </Typography>
            </Container>
          </Grid>
          {user.isActive ? (
            <>
              <Grid size={12}>
                <Container
                  maxWidth={false}
                  sx={{ bgcolor: 'surfaceContainerHigh.main' }}
                  className="rounded-md p-4"
                >
                  <Typography variant="body1" component="p" className="font-medium">
                    Start Date
                  </Typography>
                  <Typography variant="body2" component="p">
                    {user.startDate
                      ? DateTime.fromJSDate(user.startDate).toFormat('dd/LL/yyyy')
                      : 'N/A'}
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
                    End Date
                  </Typography>
                  <Typography variant="body2" component="p">
                    {user.endDate
                      ? DateTime.fromJSDate(user.endDate).toFormat('dd/LL/yyyy')
                      : 'N/A'}
                  </Typography>
                </Container>
              </Grid>
            </>
          ) : null}
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-t-md rounded-b-2xl p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Extraordinary Member
              </Typography>
              <Typography variant="body2" component="p">
                {user.isExtraordinary ? 'Yes' : 'No'}
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
