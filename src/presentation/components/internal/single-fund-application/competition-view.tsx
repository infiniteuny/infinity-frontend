import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { FundApplication } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  fundApplication: FundApplication;
};

export function CompetitionView({ fundApplication }: Props) {
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
              subtitle={fundApplication.competition?.name ?? 'N/A'}
              position="top"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Branch"
              subtitle={fundApplication.competitionBranch}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Scale"
              subtitle={fundApplication.competitionScale?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Start Date"
              subtitle={DateTime.fromJSDate(fundApplication.competitionStartDate).toFormat(
                'dd/LL/yyyy',
              )}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="End Date"
              subtitle={DateTime.fromJSDate(fundApplication.competitionEndDate).toFormat(
                'dd/LL/yyyy',
              )}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
