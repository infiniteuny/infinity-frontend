import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile } from '@app/presentation/components/internal/shared';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function AccessControlView({ user }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Access Control
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5} className="tiles-rounded-dynamic">
          <Grid size={12}>
            <ClickableViewTile
              title="Permissions"
              subtitle="Manage permission assignments"
              trailingIcon={<ChevronRightRounded />}
              href={`/users/${user.id}/permissions`}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Groups"
              subtitle="Manage group memberships"
              trailingIcon={<ChevronRightRounded />}
              href={`/users/${user.id}/groups`}
              position="middle"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
