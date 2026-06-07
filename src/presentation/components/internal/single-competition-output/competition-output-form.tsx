'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionOutput, UpdateCompetitionOutput } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';
import { CompetitionOutputToolbar } from './competition-output-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionOutputInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionOutputInput = z.infer<typeof competitionOutputInputSchema>;

type Props = {
  initialCompetitionOutput?: CompetitionOutputDto;
};

export function CompetitionOutputForm({ initialCompetitionOutput }: Props) {
  const createCompetitionOutput = useMemo(
    () => clientContainer.get<CreateCompetitionOutput>(SYMBOLS.CreateCompetitionOutput),
    [],
  );
  const updateCompetitionOutput = useMemo(
    () => clientContainer.get<UpdateCompetitionOutput>(SYMBOLS.UpdateCompetitionOutput),
    [],
  );
  const router = useRouter();

  const competitionOutput = initialCompetitionOutput
    ? CompetitionOutputMapper.fromDtoToDomain(initialCompetitionOutput)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionOutputInput>({
    mode: 'all',
    resolver: zodResolver(competitionOutputInputSchema) as Resolver<CompetitionOutputInput>,
    defaultValues: competitionOutput
      ? {
          ...competitionOutput,
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
        if (!competitionOutput) {
          const competitionOutputResult = await createCompetitionOutput.execute(data);

          match(competitionOutputResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-outputs/${data.id}`);
            },
          });
        } else {
          const competitionOutputResult = await updateCompetitionOutput.execute(
            competitionOutput.id,
            data,
          );

          match(competitionOutputResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-outputs/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition output form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={competitionOutput ? `Edit ${name}` : 'Create Competition Output'}
        backUrl={
          competitionOutput
            ? `/competition-outputs/${competitionOutput.id}`
            : '/competition-outputs'
        }
      >
        <CompetitionOutputToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
