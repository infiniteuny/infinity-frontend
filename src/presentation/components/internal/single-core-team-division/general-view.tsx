import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CoreTeamDivision } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  coreTeamDivision: CoreTeamDivision;
};

export function GeneralView({ coreTeamDivision }: Props) {
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
            <ViewTile title="Name" subtitle={coreTeamDivision.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Priority" subtitle={coreTeamDivision.priority} position="bottom" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
