import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CompetitionRank } from '@app/domain/entities';
import { DateTime } from 'luxon';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  competitionRank: CompetitionRank;
};

export function MetadataView({ competitionRank }: Props) {
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
            <ViewTile title="ID" subtitle={competitionRank.id} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Created At"
              subtitle={DateTime.fromJSDate(competitionRank.createdAt).toFormat(
                'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
              )}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Updated At"
              subtitle={DateTime.fromJSDate(competitionRank.updatedAt).toFormat(
                'cccc, d LLLL yyyy, HH:mm:ss ZZZZ',
              )}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
