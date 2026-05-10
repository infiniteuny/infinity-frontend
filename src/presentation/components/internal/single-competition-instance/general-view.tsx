import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { CompetitionInstance } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';
import { DateTime } from 'luxon';

type Props = {
  competitionInstance: CompetitionInstance;
};

export function GeneralView({ competitionInstance }: Props) {
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
            <ViewTile title="Name" subtitle={competitionInstance.name} position="top" />
          </Grid>
          {competitionInstance.shortname ? (
            <Grid size={12}>
              <ViewTile
                title="Shortname"
                subtitle={competitionInstance.shortname}
                position="middle"
              />
            </Grid>
          ) : null}
          <Grid size={12}>
            <ViewTile
              title="Description"
              subtitle={competitionInstance.description}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition"
              subtitle={competitionInstance.competition?.name || 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile title="URL" subtitle={competitionInstance.url || 'N/A'} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Organizer"
              subtitle={competitionInstance.organizer}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Organizer Type"
              subtitle={competitionInstance.organizerType?.name || 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Location" subtitle={competitionInstance.location} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Start Date"
              subtitle={DateTime.fromJSDate(competitionInstance.startDate).toFormat(
                'cccc, d LLLL yyyy',
              )}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="End Date"
              subtitle={DateTime.fromJSDate(competitionInstance.endDate).toFormat(
                'cccc, d LLLL yyyy',
              )}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
