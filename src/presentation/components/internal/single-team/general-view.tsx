import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Team } from '@app/domain/entities';

type Props = {
  team: Team;
};

export function GeneralView({ team }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Name
            </Typography>
            <Typography variant="body2" component="p">
              {team.name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Leader
            </Typography>
            <Typography variant="body2" component="p">
              {team.leader?.name ?? 'N/A'}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Team Type
            </Typography>
            <Typography variant="body2" component="p">
              {team.teamType?.name ?? 'N/A'}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Personal Team
            </Typography>
            <Typography variant="body2" component="p">
              {team.isPersonal ? 'Yes' : 'No'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
