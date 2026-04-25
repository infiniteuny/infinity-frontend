import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { User } from '@app/domain/entities';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  user: User;
};

export function GeneralView({ user }: Props) {
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
            <ViewTile title="Name" subtitle={user.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Username" subtitle={user.username} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Student ID" subtitle={user.studentId} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Faculty"
              subtitle={user.major?.faculty?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Major"
              subtitle={
                user.major
                  ? `${user.major.degree ? `${user.major.degree.name} - ` : ''}${user.major.name}`
                  : 'N/A'
              }
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
