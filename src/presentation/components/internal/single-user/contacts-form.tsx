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
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Contacts
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              {...register('emailAddress')}
              id="emailAddress"
              label="Email Address"
              fullWidth
              margin="none"
              helperText={errors.emailAddress?.message}
              error={!!errors.emailAddress}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('phoneNumber')}
              id="phoneNumber"
              label="Phone Number"
              fullWidth
              margin="none"
              placeholder="+62xxxxxxxxxx"
              helperText={errors.phoneNumber?.message}
              error={!!errors.phoneNumber}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
