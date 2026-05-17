import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile } from '@app/presentation/components/internal/shared';
import { useInternalStore } from '@app/presentation/hooks';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function AccessControlView({ user }: Props) {
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Access Control
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5} className="tiles-rounded-dynamic">
          {['read-user-permission'].some((p) => userPermissions.has(p)) ||
          (['read-own-user-permission'].some((p) => userPermissions.has(p)) &&
            user.id === userSession?.user.id) ? (
            <Grid size={12}>
              <ClickableViewTile
                title="Permissions"
                subtitle="View and manage permission assignments"
                trailingIcon={<ChevronRightRounded />}
                href={`/users/${user.id}/permissions`}
                position="middle"
              />
            </Grid>
          ) : null}
          {['read-user-group'].some((p) => userPermissions.has(p)) ||
          (['read-own-user-group'].some((p) => userPermissions.has(p)) &&
            user.id === userSession?.user.id) ? (
            <Grid size={12}>
              <ClickableViewTile
                title="Groups"
                subtitle="View and manage group memberships"
                trailingIcon={<ChevronRightRounded />}
                href={`/users/${user.id}/groups`}
                position="middle"
              />
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
