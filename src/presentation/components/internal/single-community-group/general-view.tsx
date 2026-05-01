import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CommunityGroup } from '@app/domain/entities';
import { SettingTile } from '@app/presentation/components/internal/settings';
import { ViewTile } from '@app/presentation/components/internal/shared';
import { ChevronRightRounded } from '@mui/icons-material';

type Props = {
  communityGroup: CommunityGroup;
};

export function GeneralView({ communityGroup }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <ViewTile title="Name" subtitle={communityGroup.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Description" subtitle={communityGroup.description} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Priority" subtitle={communityGroup.priority} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Active"
              subtitle={communityGroup.isActive ? 'Yes' : 'No'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <SettingTile
              title="Members"
              subtitle="Manage community group members"
              trailingIcon={<ChevronRightRounded />}
              href={`/community-groups/${communityGroup.id}/members`}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
