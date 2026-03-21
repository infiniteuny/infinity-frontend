import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { PermissionInput } from './permission-form';

type Props = {
  methods: UseFormReturn<PermissionInput>;
};

export function GeneralForm({
  methods: {
    register,
    control,
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
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              id="name"
              label="Name"
              fullWidth
              margin="none"
              helperText={errors.name?.message}
              error={!!errors.name}
              disabled={isSubmitting}
              {...register('name')}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="guardName-label" error={!!errors.guardName}>
                Guard Name
              </InputLabel>
              <Controller
                name="guardName"
                control={control}
                defaultValue={'api'}
                render={({ field }) => (
                  <Select
                    labelId="guardName-label"
                    label="Guard Name"
                    error={!!errors.guardName}
                    {...field}
                  >
                    <MenuItem key="api" value="api">
                      api
                    </MenuItem>
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.guardName}>
                {errors.guardName?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
