import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { UserInput } from './user-form';

type Props = {
  methods: UseFormReturn<UserInput>;
};

export function ContactsForm({
  methods: {
    register,
    formState: { isSubmitting, errors },
  },
}: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Contacts
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              id="emailAddress"
              label="Email Address"
              fullWidth
              margin="none"
              helperText={errors.emailAddress?.message}
              error={!!errors.emailAddress}
              disabled={isSubmitting}
              {...register('emailAddress')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              id="phoneNumber"
              label="Phone Number"
              fullWidth
              margin="none"
              placeholder="+62xxxxxxxxxx"
              helperText={errors.phoneNumber?.message}
              error={!!errors.phoneNumber}
              disabled={isSubmitting}
              {...register('phoneNumber')}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
