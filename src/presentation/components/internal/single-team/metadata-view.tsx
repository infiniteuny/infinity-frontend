import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { Team } from '@app/domain/entities';

type Props = {
  team: Team;
};

export function MetadataView({ team }: Props) {
  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Metadata
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              ID
            </Typography>
            <Typography variant="body2" component="p">
              {team.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Created At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(team.createdAt).toFormat('cccc, d LLLL yyyy, HH:mm:ss ZZZZ')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Updated At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(team.updatedAt).toFormat('cccc, d LLLL yyyy, HH:mm:ss ZZZZ')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
