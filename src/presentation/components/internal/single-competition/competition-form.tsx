'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetition, UpdateCompetition } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@app/infrastructure/dtos';
import { CompetitionToolbar } from './competition-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  shortname: z.string().min(2, 'Shortname must be at least 2 characters').nullable(),
  description: z.string().min(1, 'Description must not be empty'),
});

export type CompetitionInput = z.infer<typeof competitionInputSchema>;

type Props = {
  initialCompetition?: CompetitionDto;
};

export function CompetitionForm({ initialCompetition }: Props) {
  const createCompetition = useMemo(
    () => clientContainer.get<CreateCompetition>(SYMBOLS.CreateCompetition),
    [],
  );
  const updateCompetition = useMemo(
    () => clientContainer.get<UpdateCompetition>(SYMBOLS.UpdateCompetition),
    [],
  );
  const router = useRouter();

  const competition = initialCompetition
    ? CompetitionMapper.fromDtoToDomain(initialCompetition)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionInput>({
    mode: 'all',
    resolver: zodResolver(competitionInputSchema) as Resolver<CompetitionInput>,
    defaultValues: competition
      ? {
          ...competition,
        }
      : {
          name: '',
          shortname: '',
          description: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!competition) {
          const competitionResult = await createCompetition.execute({
            ...data,
            shortname: data.shortname || null,
          });

          match(competitionResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competitions/${data.id}`);
            },
          });
        } else {
          const competitionResult = await updateCompetition.execute(competition.id, {
            ...data,
            shortname: data.shortname || null,
          });

          match(competitionResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competitions/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={competition ? name : 'Create Competition'}>
        <CompetitionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
