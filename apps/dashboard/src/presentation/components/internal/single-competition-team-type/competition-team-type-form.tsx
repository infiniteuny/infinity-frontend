'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CreateCompetitionTeamType,
  UpdateCompetitionTeamType,
} from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/presentation/utils';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { CompetitionTeamTypeToolbar } from './competition-team-type-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionTeamTypeInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionTeamTypeInput = z.infer<typeof competitionTeamTypeInputSchema>;

type Props = {
  initialCompetitionTeamType?: CompetitionTeamTypeDto;
};

export function CompetitionTeamTypeForm({ initialCompetitionTeamType }: Props) {
  const createCompetitionTeamType = useMemo(
    () => clientContainer.get<CreateCompetitionTeamType>(SYMBOLS.CreateCompetitionTeamType),
    [],
  );
  const updateCompetitionTeamType = useMemo(
    () => clientContainer.get<UpdateCompetitionTeamType>(SYMBOLS.UpdateCompetitionTeamType),
    [],
  );
  const router = useRouter();

  const competitionTeamType = initialCompetitionTeamType
    ? CompetitionTeamTypeMapper.fromDtoToDomain(initialCompetitionTeamType)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionTeamTypeInput>({
    mode: 'all',
    resolver: zodResolver(competitionTeamTypeInputSchema) as Resolver<CompetitionTeamTypeInput>,
    defaultValues: competitionTeamType
      ? {
          name: competitionTeamType.name,
          weight: competitionTeamType.weight,
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
        if (!competitionTeamType) {
          const competitionTeamTypeResult = await createCompetitionTeamType.execute(data);

          match(competitionTeamTypeResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to create team type.');
            },
            onRight: (data) => {
              toast.success('Team type created successfully.');
              router.push(`/team-types/${data.id}`);
            },
          });
        } else {
          const competitionTeamTypeResult = await updateCompetitionTeamType.execute(
            competitionTeamType.id,
            data,
          );

          match(competitionTeamTypeResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to update team type.');
            },
            onRight: (data) => {
              toast.success('Team type updated successfully.');
              router.push(`/team-types/${data.id}`);
            },
          });
        }
      } catch (error) {
        handleFormError(error, methods, 'Failed to save team type.');
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={competitionTeamType ? `Edit ${name}` : 'Create Competition Team Type'}
        backUrl={competitionTeamType ? `/team-types/${competitionTeamType.id}` : '/team-types'}
      >
        <CompetitionTeamTypeToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
