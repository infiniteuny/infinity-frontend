import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { Group } from '@app/domain/entities';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  group: Group;
};

export function GeneralView({ group }: Props) {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5} className="tiles-rounded-dynamic">
          <Grid size={12}>
            <ViewTile title="Name" subtitle={group.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Guard Name" subtitle={group.guardName} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Managed" subtitle={group.isManaged ? 'Yes' : 'No'} position="middle" />
          </Grid>
          {['read-group-permission'].some((p) => userPermissions.has(p)) ? (
            <Grid size={12}>
              <ClickableViewTile
                title="Permissions"
                subtitle="View and manage permission assignments"
                trailingIcon={<ChevronRightRounded />}
                href={`/groups/${group.id}/permissions`}
                position="bottom"
              />
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
