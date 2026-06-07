'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateMajor, UpdateMajor } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { DegreeDto, FacultyDto, MajorDto, MajorMapper } from '@app/infrastructure/dtos';
import { MajorToolbar } from './major-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const majorInputSchema = z.object({
  code: z.string().min(1, 'Code must not be empty'),
  name: z.string().min(1, 'Name must not be empty'),
  degreeId: z.uuidv7('Degree must be selected'),
  facultyId: z.uuidv7('Faculty must be selected'),
});

export type MajorInput = z.infer<typeof majorInputSchema>;

type Props = {
  initialMajor?: MajorDto;
  degrees: DegreeDto[];
  faculties: FacultyDto[];
};

export function MajorForm({ initialMajor, degrees, faculties }: Props) {
  const createMajor = useMemo(() => clientContainer.get<CreateMajor>(SYMBOLS.CreateMajor), []);
  const updateMajor = useMemo(() => clientContainer.get<UpdateMajor>(SYMBOLS.UpdateMajor), []);
  const router = useRouter();

  const major = initialMajor ? MajorMapper.fromDtoToDomain(initialMajor) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<MajorInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(majorInputSchema) as Resolver<MajorInput>,
    defaultValues: major
      ? {
          ...major,
        }
      : {
          code: '',
          name: '',
          degreeId: '',
          facultyId: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!major) {
          const majorResult = await createMajor.execute(data);

          match(majorResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/majors/${data.id}`);
            },
          });
        } else {
          const majorResult = await updateMajor.execute(major.id, data);

          match(majorResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/majors/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting major form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={major ? `Edit ${name}` : 'Create Major'}
        backUrl={major ? `/majors/${major.id}` : '/majors'}
      >
        <MajorToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} degrees={degrees} faculties={faculties} />
      </Box>
    </>
  );
}
