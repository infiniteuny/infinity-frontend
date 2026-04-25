'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionOrganizerType, UpdateCompetitionOrganizerType } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { CompetitionOrganizerTypeToolbar } from './competition-organizer-type-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionOrganizerTypeInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionOrganizerTypeInput = z.infer<typeof competitionOrganizerTypeInputSchema>;

type Props = {
  initialCompetitionOrganizerType?: CompetitionOrganizerTypeDto;
};

export function CompetitionOrganizerTypeForm({ initialCompetitionOrganizerType }: Props) {
  const createCompetitionOrganizerType = useMemo(
    () =>
      clientContainer.get<CreateCompetitionOrganizerType>(SYMBOLS.CreateCompetitionOrganizerType),
    [],
  );
  const updateCompetitionOrganizerType = useMemo(
    () =>
      clientContainer.get<UpdateCompetitionOrganizerType>(SYMBOLS.UpdateCompetitionOrganizerType),
    [],
  );
  const router = useRouter();

  const competitionOrganizerType = initialCompetitionOrganizerType
    ? CompetitionOrganizerTypeMapper.fromDtoToDomain(initialCompetitionOrganizerType)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionOrganizerTypeInput>({
    mode: 'all',
    resolver: zodResolver(
      competitionOrganizerTypeInputSchema,
    ) as Resolver<CompetitionOrganizerTypeInput>,
    defaultValues: competitionOrganizerType
      ? {
          ...competitionOrganizerType,
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
        if (!competitionOrganizerType) {
          const competitionOrganizerTypeResult = await createCompetitionOrganizerType.execute(data);

          match(competitionOrganizerTypeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-organizer-types/${data.id}`);
            },
          });
        } else {
          const competitionOrganizerTypeResult = await updateCompetitionOrganizerType.execute(
            competitionOrganizerType.id,
            data,
          );

          match(competitionOrganizerTypeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-organizer-types/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition organizer type form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={competitionOrganizerType ? name : 'Create Competition Organizer Type'}>
        <CompetitionOrganizerTypeToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
