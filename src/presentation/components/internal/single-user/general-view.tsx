import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { User } from '@app/domain/entities';

type Props = {
  user: User;
};

export function GeneralView({ user }: Props) {
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
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Name
            </Typography>
            <Typography variant="body2" component="p">
              {user.name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Username
            </Typography>
            <Typography variant="body2" component="p">
              {user.username}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Student ID
            </Typography>
            <Typography variant="body2" component="p">
              {user.studentId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Faculty
            </Typography>
            <Typography variant="body2" component="p">
              {user.major?.faculty?.name ?? 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" component="p" className="font-medium">
              Major
            </Typography>
            <Typography variant="body2" component="p">
              {user.major
                ? `${user.major.degree ? `${user.major.degree.name} - ` : ''}${user.major.name}`
                : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
