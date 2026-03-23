import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CoreTeam } from '@app/domain/entities';

type Props = {
  coreTeam: CoreTeam;
};

export function GeneralView({ coreTeam }: Props) {
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Year
            </Typography>
            <Typography variant="body2" component="p">
              {coreTeam.year}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Active
            </Typography>
            <Typography variant="body2" component="p">
              {coreTeam.isActive ? 'Yes' : 'No'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
