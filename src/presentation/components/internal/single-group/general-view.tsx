import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Group } from '@app/domain/entities';

type Props = {
  group: Group;
};

export function GeneralView({ group }: Props) {
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
              {group.name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Guard Name
            </Typography>
            <Typography variant="body2" component="p">
              {group.guardName}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
