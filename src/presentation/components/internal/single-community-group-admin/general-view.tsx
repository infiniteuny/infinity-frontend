import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { CommunityGroupAdmin } from '@app/domain/entities';

type Props = {
  communityGroupAdmin: CommunityGroupAdmin;
};

export function GeneralView({ communityGroupAdmin }: Props) {
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
            <ViewTile title="Year" subtitle={communityGroupAdmin.year} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Active"
              subtitle={communityGroupAdmin.isActive ? 'Yes' : 'No'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Members"
              subtitle="View and manage community group administrator members"
              trailingIcon={<ChevronRightRounded />}
              href={`/community-group-admins/${communityGroupAdmin.id}/members`}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
