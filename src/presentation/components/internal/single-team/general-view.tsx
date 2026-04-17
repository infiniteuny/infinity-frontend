import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Team } from '@app/domain/entities';

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
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-t-2xl rounded-b-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Name
              </Typography>
              <Typography variant="body2" component="p">
                {team.name}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Leader
              </Typography>
              <Typography variant="body2" component="p">
                {team.leader?.name ?? 'N/A'}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Team Type
              </Typography>
              <Typography variant="body2" component="p">
                {team.teamType?.name ?? 'N/A'}
              </Typography>
            </Container>
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-t-md rounded-b-2xl p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Personal Team
              </Typography>
              <Typography variant="body2" component="p">
                {team.isPersonal ? 'Yes' : 'No'}
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
