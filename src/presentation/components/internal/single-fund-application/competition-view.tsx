import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { FundApplication } from '@app/domain/entities';

type Props = {
  fundApplication: FundApplication;
};

export function CompetitionView({ fundApplication }: Props) {
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
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Name
            </Typography>
            <Typography variant="body2" component="p">
              {fundApplication.competition?.name ?? 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Branch
            </Typography>
            <Typography variant="body2" component="p">
              {fundApplication.competitionBranch}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Scale
            </Typography>
            <Typography variant="body2" component="p">
              {fundApplication.competitionScale?.name ?? 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Start Date
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(fundApplication.competitionStartDate).toFormat('dd/LL/yyyy')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              End Date
            </Typography>
            <Typography variant="body2" component="p">
              {DateTime.fromJSDate(fundApplication.competitionEndDate).toFormat('dd/LL/yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
