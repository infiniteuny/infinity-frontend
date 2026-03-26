import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { Achievement } from '@app/domain/entities';

type Props = {
  achievement: Achievement;
};

export function CompetitionView({ achievement }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Competition
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Name
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competition?.name ?? 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Branch
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competitionBranch}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Scale
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competitionScale?.name ?? achievement.competitionScaleId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Time Range
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competitionTimeRange?.name ?? achievement.competitionTimeRangeId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Output
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competitionOutput?.name ?? achievement.competitionOutputId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Rank
            </Typography>
            <Typography variant="body2" component="p">
              {achievement.competitionRank?.name ?? achievement.competitionRankId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition Start Date
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(achievement.competitionStartDate).toFormat('dd/LL/yyyy')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Competition End Date
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(achievement.competitionEndDate).toFormat('dd/LL/yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
