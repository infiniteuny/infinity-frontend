import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { Achievement } from '@app/domain/entities';

type Props = {
  achievement: Achievement;
};

export function MetadataView({ achievement }: Props) {
  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Metadata
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
                ID
              </Typography>
              <Typography variant="body2" component="p">
                {achievement.id}
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
                Created At
              </Typography>
              <Typography variant="body2" component="p">
                {DateTime.fromJSDate(achievement.createdAt).toFormat(
                  'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
                )}
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
                Updated At
              </Typography>
              <Typography variant="body2" component="p">
                {DateTime.fromJSDate(achievement.updatedAt).toFormat(
                  'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
                )}
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
