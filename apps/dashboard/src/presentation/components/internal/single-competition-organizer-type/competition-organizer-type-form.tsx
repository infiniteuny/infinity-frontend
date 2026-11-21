'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CreateCompetitionOrganizerType,
  UpdateCompetitionOrganizerType,
} from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/presentation/utils';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
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
          name: competitionOrganizerType.name,
          weight: competitionOrganizerType.weight,
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
              handleFormError(error, methods, 'Failed to create competition organizer type.');
            },
            onRight: (data) => {
              toast.success('Competition organizer type created successfully.');
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
              handleFormError(error, methods, 'Failed to update competition organizer type.');
            },
            onRight: (data) => {
              toast.success('Competition organizer type updated successfully.');
              router.push(`/competition-organizer-types/${data.id}`);
            },
          });
        }
      } catch (error) {
        handleFormError(error, methods, 'Failed to save competition organizer type.');
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={competitionOrganizerType ? `Edit ${name}` : 'Create Competition Organizer Type'}
        backUrl={
          competitionOrganizerType
            ? `/competition-organizer-types/${competitionOrganizerType.id}`
            : '/competition-organizer-types'
        }
      >
        <CompetitionOrganizerTypeToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
