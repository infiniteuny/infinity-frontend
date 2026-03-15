import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { Permission } from '@app/domain/entities';

type Props = {
  permission: Permission;
};

export function GeneralView({ permission }: Props) {
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
              {permission.name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" component="p" className="font-medium">
              Guard Name
            </Typography>
            <Typography variant="body2" component="p">
              {permission.guardName}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
