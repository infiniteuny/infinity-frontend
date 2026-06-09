import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
  isProfileView?: boolean;
};

export function MembershipView({ user, isProfileView }: Props) {
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
            <ViewTile title="Member" subtitle={user.isMember ? 'Yes' : 'No'} position="top" />
          </Grid>
          {user.isMember ? (
            <>
              <Grid size={12}>
                <ViewTile
                  title="Active Member"
                  subtitle={user.isActive ? 'Yes' : 'No'}
                  position="middle"
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
                        user.endDate
                          ? DateTime.fromJSDate(user.endDate).toFormat('dd/LL/yyyy')
                          : 'N/A'
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
                  position="middle"
                />
              </Grid>
            </>
          ) : null}
          <Grid size={12}>
            <ClickableViewTile
              title="Personas"
              subtitle="View and manage personas"
              trailingIcon={<ChevronRightRounded />}
              href={isProfileView ? `/settings/profile/personas` : `/users/${user.id}/personas`}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Community Groups"
              subtitle="View and manage community groups membership"
              trailingIcon={<ChevronRightRounded />}
              href={
                isProfileView
                  ? `/settings/profile/community-groups`
                  : `/users/${user.id}/community-groups`
              }
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
