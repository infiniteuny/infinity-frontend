import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { SettingTile } from '@app/presentation/components/internal/settings';
import { Team } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';
import { ChevronRightRounded } from '@mui/icons-material';

type Props = {
  team: Team;
};

export function GeneralView({ team }: Props) {
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
            <ViewTile title="Name" subtitle={team.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Leader" subtitle={team.leader?.name ?? 'N/A'} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Team Type" subtitle={team.teamType?.name ?? 'N/A'} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Personal Team"
              subtitle={team.isPersonal ? 'Yes' : 'No'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <SettingTile
              title="Members"
              subtitle="Manage team members"
              trailingIcon={<ChevronRightRounded />}
              href={`/teams/${team.id}/members`}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
