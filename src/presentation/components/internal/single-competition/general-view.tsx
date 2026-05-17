import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { Competition } from '@app/domain/entities';

type Props = {
  competition: Competition;
};

export function GeneralView({ competition }: Props) {
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
            <ViewTile title="Name" subtitle={competition.name} position="top" />
          </Grid>
          {competition.shortname ? (
            <Grid size={12}>
              <ViewTile title="Shortname" subtitle={competition.shortname} position="middle" />
            </Grid>
          ) : null}
          <Grid size={12}>
            <ViewTile title="Description" subtitle={competition.description} position="middle" />
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Instances"
              subtitle="Manage instances of this competition"
              position="bottom"
              trailingIcon={<ChevronRightRounded />}
              href={`/competitions/${competition.id}/instances`}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
