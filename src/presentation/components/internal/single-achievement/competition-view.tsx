import { Achievement } from '@app/domain/entities';
import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  achievement: Achievement;
};

export function CompetitionView({ achievement }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Competition
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <ViewTile
              title="Name"
              subtitle={achievement.competitionInstance?.name ?? 'N/A'}
              position="top"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Branch"
              subtitle={achievement.competitionBranch}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Scale"
              subtitle={achievement.competitionScale?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Time Range"
              subtitle={achievement.competitionTimeRange?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Output"
              subtitle={achievement.competitionOutput?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Rank"
              subtitle={achievement.competitionRank?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition Start Date"
              subtitle={DateTime.fromJSDate(achievement.competitionStartDate).toFormat(
                'cccc, d LLLL yyyy',
              )}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Competition End Date"
              subtitle={DateTime.fromJSDate(achievement.competitionEndDate).toFormat(
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
