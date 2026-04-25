import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { User } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';

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
            <ViewTile
              title="Active Member"
              subtitle={user.isActive ? 'Yes' : 'No'}
              position="top"
            />
          </Grid>
          {user.isActive ? (
            <>
              <Grid size={12}>
                <ViewTile
                  title="Start Date"
                  subtitle={
                    user.startDate
                      ? DateTime.fromJSDate(user.startDate).toFormat('dd/LL/yyyy')
                      : 'N/A'
                  }
                  position="middle"
                />
              </Grid>
              <Grid size={12}>
                <ViewTile
                  title="End Date"
                  subtitle={
                    user.endDate ? DateTime.fromJSDate(user.endDate).toFormat('dd/LL/yyyy') : 'N/A'
                  }
                  position="middle"
                />
              </Grid>
            </>
          ) : null}
          <Grid size={12}>
            <ViewTile
              title="Extraordinary Member"
              subtitle={user.isExtraordinary ? 'Yes' : 'No'}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
