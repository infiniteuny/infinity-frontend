'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionScale, UpdateCompetitionScale } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionScaleDto, CompetitionScaleMapper } from '@app/infrastructure/dtos';
import { CompetitionScaleToolbar } from './competition-scale-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionScaleInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionScaleInput = z.infer<typeof competitionScaleInputSchema>;

type Props = {
  initialCompetitionScale?: CompetitionScaleDto;
};

export function CompetitionScaleForm({ initialCompetitionScale }: Props) {
  const createCompetitionScale = useMemo(
    () => clientContainer.get<CreateCompetitionScale>(SYMBOLS.CreateCompetitionScale),
    [],
  );
  const updateCompetitionScale = useMemo(
    () => clientContainer.get<UpdateCompetitionScale>(SYMBOLS.UpdateCompetitionScale),
    [],
  );
  const router = useRouter();

  const competitionScale = initialCompetitionScale
    ? CompetitionScaleMapper.fromDtoToDomain(initialCompetitionScale)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionScaleInput>({
    mode: 'all',
    resolver: zodResolver(competitionScaleInputSchema) as Resolver<CompetitionScaleInput>,
    defaultValues: competitionScale
      ? {
          ...competitionScale,
        }
      : {
          name: '',
          weight: 0,
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!competitionScale) {
          const competitionScaleResult = await createCompetitionScale.execute(data);

          match(competitionScaleResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-scales/${data.id}`);
            },
          });
        } else {
          const competitionScaleResult = await updateCompetitionScale.execute(
            competitionScale.id,
            data,
          );

          match(competitionScaleResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-scales/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition scale form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={competitionScale ? name : 'Create Competition Scale'}>
        <CompetitionScaleToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
