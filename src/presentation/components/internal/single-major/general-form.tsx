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
import { MajorInput } from './major-form';
import { DegreeDto, DegreeMapper, FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import { useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<MajorInput>;
  degrees: DegreeDto[];
  faculties: FacultyDto[];
};

export function GeneralForm({
  methods: {
    register,
    control,
    formState: { isSubmitting, errors },
  },
  degrees,
  faculties,
}: Props) {
  const parsedDegrees = useMemo(() => degrees.map(DegreeMapper.fromDtoToDomain), [degrees]);
  const parsedFaculties = useMemo(() => faculties.map(FacultyMapper.fromDtoToDomain), [faculties]);

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
              {...register('code')}
              id="code"
              label="Code"
              fullWidth
              margin="none"
              helperText={errors.code?.message}
              error={!!errors.code}
              disabled={isSubmitting}
            />
          </Grid>
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
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="degreeId-label" error={!!errors.degreeId}>
                Degree
              </InputLabel>
              <Controller
                name="degreeId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="degreeId-label"
                    label="degreeId"
                    error={!!errors.degreeId}
                  >
                    {parsedDegrees.map((degree) => (
                      <MenuItem key={degree.id} value={degree.id}>
                        {degree.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.degreeId}>{errors.degreeId?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="facultyId-label" error={!!errors.facultyId}>
                Faculty
              </InputLabel>
              <Controller
                name="facultyId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="facultyId-label"
                    label="facultyId"
                    error={!!errors.facultyId}
                  >
                    {parsedFaculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.facultyId}>
                {errors.facultyId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
