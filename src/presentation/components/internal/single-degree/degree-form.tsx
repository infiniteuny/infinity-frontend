'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateDegree, UpdateDegree } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';
import { DegreeToolbar } from './degree-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const degreeInputSchema = z.object({
  code: z.string().min(1, 'Code must not be empty'),
  name: z.string().min(1, 'Name must not be empty'),
});

export type DegreeInput = z.infer<typeof degreeInputSchema>;

type Props = {
  initialDegree?: DegreeDto;
};

export function DegreeForm({ initialDegree }: Props) {
  const createDegree = useMemo(() => clientContainer.get<CreateDegree>(SYMBOLS.CreateDegree), []);
  const updateDegree = useMemo(() => clientContainer.get<UpdateDegree>(SYMBOLS.UpdateDegree), []);
  const router = useRouter();

  const degree = initialDegree ? DegreeMapper.fromDtoToDomain(initialDegree) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<DegreeInput>({
    mode: 'all',
    resolver: zodResolver(degreeInputSchema) as Resolver<DegreeInput>,
    defaultValues: degree
      ? {
          ...degree,
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
        if (!degree) {
          const degreeResult = await createDegree.execute(data);

          match(degreeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/degrees/${data.id}`);
            },
          });
        } else {
          const degreeResult = await updateDegree.execute(degree.id, data);

          match(degreeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/degrees/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting degree form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={degree ? name : 'Create Degree'}>
        <DegreeToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
