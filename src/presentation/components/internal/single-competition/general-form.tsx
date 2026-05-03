import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { CompetitionInput } from './competition-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<CompetitionInput>;
};

export function GeneralForm({
  methods: {
    register,
    formState: { isSubmitting, errors },
  },
}: Props) {
  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              {...register('name')}
              id="name"
              label="Name"
              fullWidth
              margin="none"
              helperText={errors.name?.message}
              error={!!errors.name}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('description')}
              id="description"
              label="Description"
              fullWidth
              margin="none"
              multiline
              minRows={4}
              helperText={errors.description?.message}
              error={!!errors.description}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
