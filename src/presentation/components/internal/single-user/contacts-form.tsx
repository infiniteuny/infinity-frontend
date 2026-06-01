import { Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { UserInput } from './user-form';

type Props = {
  methods: UseFormReturn<UserInput>;
  className?: string;
};

export function ContactsForm({
  methods: {
    register,
    formState: { isSubmitting, errors },
  },
  className,
}: Props) {
  return (
    <Box component="section" className={`w-full px-6 ${className || ''}`}>
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
          <Grid size={12}>
            <TextField
              {...register('linkedin')}
              id="linkedin"
              label="LinkedIn"
              fullWidth
              margin="none"
              helperText={
                errors.linkedin?.message ||
                "Fill in the username only, e.g. 'john-doe' from URL 'https://www.linkedin.com/in/john-doe'"
              }
              error={!!errors.linkedin}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('github')}
              id="github"
              label="GitHub"
              fullWidth
              margin="none"
              helperText={
                errors.github?.message ||
                "Fill in the username only, e.g. 'johndoe' from URL 'https://github.com/johndoe'"
              }
              error={!!errors.github}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('discord')}
              id="discord"
              label="Discord"
              fullWidth
              margin="none"
              helperText={errors.discord?.message}
              error={!!errors.discord}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
