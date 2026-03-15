import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { Permission } from '@app/domain/entities';

type Props = {
  pemission: Permission;
};

export function MetadataView({ pemission }: Props) {
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
              {pemission.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Created At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(pemission.createdAt).toFormat(
                'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
              )}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Updated At
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(pemission.updatedAt).toFormat(
                'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
              )}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
