import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { Group } from '@app/domain/entities';
import { ChevronRightRounded } from '@mui/icons-material';

type Props = {
  group: Group;
};

export function GeneralView({ group }: Props) {
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
            <ViewTile title="Name" subtitle={group.name} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Guard Name" subtitle={group.guardName} position="middle" />
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Permissions"
              subtitle="Manage permission assignments"
              trailingIcon={<ChevronRightRounded />}
              href={`/groups/${group.id}/permissions`}
              position="middle"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
