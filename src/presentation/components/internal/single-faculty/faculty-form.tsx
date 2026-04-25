'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateFaculty, UpdateFaculty } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import { FacultyToolbar } from './faculty-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const facultyInputSchema = z.object({
  code: z.string().min(1, 'Code must not be empty'),
  name: z.string().min(1, 'Name must not be empty'),
});

export type FacultyInput = z.infer<typeof facultyInputSchema>;

type Props = {
  initialFaculty?: FacultyDto;
};

export function FacultyForm({ initialFaculty }: Props) {
  const createFaculty = useMemo(
    () => clientContainer.get<CreateFaculty>(SYMBOLS.CreateFaculty),
    [],
  );
  const updateFaculty = useMemo(
    () => clientContainer.get<UpdateFaculty>(SYMBOLS.UpdateFaculty),
    [],
  );
  const router = useRouter();

  const faculty = initialFaculty ? FacultyMapper.fromDtoToDomain(initialFaculty) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<FacultyInput>({
    mode: 'all',
    resolver: zodResolver(facultyInputSchema) as Resolver<FacultyInput>,
    defaultValues: faculty
      ? {
          ...faculty,
        }
      : {
          code: '',
          name: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!faculty) {
          const facultyResult = await createFaculty.execute(data);

          match(facultyResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/faculties/${data.id}`);
            },
          });
        } else {
          const facultyResult = await updateFaculty.execute(faculty.id, data);

          match(facultyResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/faculties/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting faculty form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={faculty ? name : 'Create Faculty'}>
        <FacultyToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
