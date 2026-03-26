import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Achievement } from '@app/domain/entities';

type Props = {
  achievement: Achievement;
};

export function DocumentsView({ achievement }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Image
            </Typography>
            <Box
              component="img"
              src={achievement.image as string}
              alt={`${achievement.competition?.name} ${achievement.competitionBranch}`}
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'contain',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
