import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function MetadataView({ user }: Props) {
  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <Toolbar component="header" className="min-h-10 h-auto p-0 mb-4">
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
              {user.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Created At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(user.createdAt).toFormat('cccc, d LLLL yyyy, HH:mm:ss ZZZZ')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Updated At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(user.updatedAt).toFormat('cccc, d LLLL yyyy, HH:mm:ss ZZZZ')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
