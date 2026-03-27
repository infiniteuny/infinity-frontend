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
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FacultyDto, FacultyMapper, MajorDto, MajorMapper } from '@app/infrastructure/dtos';
import { GetMajors } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useCallback, useMemo, useState } from 'react';
import { UserInput } from './user-form';

type Props = {
  methods: UseFormReturn<UserInput>;
  faculties: FacultyDto[];
  majors?: MajorDto[];
};

export function GeneralForm({
  methods: {
    register,
    control,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  },
  faculties,
  majors,
}: Props) {
  const getMajors = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);
  const parsedFaculties = useMemo(() => faculties.map(FacultyMapper.fromDtoToDomain), [faculties]);
  const parsedMajors = useMemo(() => majors?.map(MajorMapper.fromDtoToDomain) ?? [], [majors]);

  const [majorOptions, setMajorOptions] = useState(majors ? parsedMajors : []);
  const [majorDisabled, setMajorDisabled] = useState(false);

  const handleFacultyChange = useCallback(
    async (facultyId: string) => {
      setMajorDisabled(true);

      const majorsResult = await getMajors.execute(['degree'], { facultyId }, { perPage: 100 });

      match(majorsResult, {
        onLeft: (error) => {
          console.error(error);
          setMajorOptions([]);
        },
        onRight: (data) => {
          if (!data[0].find((major) => major.id === getValues('majorId'))) {
            setValue('majorId', '0');
          }
          setMajorOptions(data[0]);
        },
      });

      setMajorDisabled(false);
    },
    [getMajors, getValues, setValue],
  );

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
              {...register('username')}
              id="username"
              label="Username"
              fullWidth
              margin="none"
              helperText={errors.username?.message}
              error={!!errors.username}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('studentId')}
              id="studentId"
              label="Student ID"
              fullWidth
              margin="none"
              helperText={errors.studentId?.message}
              error={!!errors.studentId}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="facultyId-label" error={!!errors.facultyId}>
                Faculty
              </InputLabel>
              <Controller
                name="facultyId"
                control={control}
                defaultValue={'0'}
                render={({ field: { onChange, ...field } }) => (
                  <Select
                    {...field}
                    labelId="facultyId-label"
                    label="Faculty"
                    error={!!errors.facultyId}
                    onChange={(event) => {
                      onChange(event);
                      const facultyId = event.target.value;

                      if (facultyId && facultyId !== '0') {
                        handleFacultyChange(facultyId);
                      }
                    }}
                  >
                    <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                      Select faculty
                    </MenuItem>
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
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="none" disabled={isSubmitting || majorDisabled}>
              <InputLabel id="majorId-label" error={!!errors.majorId}>
                Major
              </InputLabel>
              <Controller
                name="majorId"
                control={control}
                defaultValue={'0'}
                render={({ field }) => (
                  <Select {...field} labelId="majorId-label" label="Major" error={!!errors.majorId}>
                    {majorOptions.length > 0 ? (
                      [
                        <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                          Select major
                        </MenuItem>,
                        ...majorOptions.map((major) => (
                          <MenuItem key={major.id} value={major.id}>
                            {major.degree?.name} - {major.name}
                          </MenuItem>
                        )),
                      ]
                    ) : (
                      <MenuItem key="0" value="0" disabled>
                        Select faculty first
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.majorId}>{errors.majorId?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
