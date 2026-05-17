import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { Team } from '@app/domain/entities';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  team: Team;
};

export function GeneralView({ team }: Props) {
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

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
          {['read-team-member'].some((p) => userPermissions.has(p)) ||
          (['read-own-team-member'].some((p) => userPermissions.has(p)) &&
            team.members?.some((member) => member.id === userSession?.user.id)) ? (
            <Grid size={12}>
              <ClickableViewTile
                title="Members"
                subtitle="View and manage team members"
                trailingIcon={<ChevronRightRounded />}
                href={`/teams/${team.id}/members`}
                position="bottom"
              />
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
