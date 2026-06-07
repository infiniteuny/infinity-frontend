'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionTimeRange, UpdateCompetitionTimeRange } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import { CompetitionTimeRangeToolbar } from './competition-time-range-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionTimeRangeInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionTimeRangeInput = z.infer<typeof competitionTimeRangeInputSchema>;

type Props = {
  initialCompetitionTimeRange?: CompetitionTimeRangeDto;
};

export function CompetitionTimeRangeForm({ initialCompetitionTimeRange }: Props) {
  const createCompetitionTimeRange = useMemo(
    () => clientContainer.get<CreateCompetitionTimeRange>(SYMBOLS.CreateCompetitionTimeRange),
    [],
  );
  const updateCompetitionTimeRange = useMemo(
    () => clientContainer.get<UpdateCompetitionTimeRange>(SYMBOLS.UpdateCompetitionTimeRange),
    [],
  );
  const router = useRouter();

  const competitionTimeRange = initialCompetitionTimeRange
    ? CompetitionTimeRangeMapper.fromDtoToDomain(initialCompetitionTimeRange)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionTimeRangeInput>({
    mode: 'all',
    resolver: zodResolver(competitionTimeRangeInputSchema) as Resolver<CompetitionTimeRangeInput>,
    defaultValues: competitionTimeRange
      ? {
          ...competitionTimeRange,
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
        if (!competitionTimeRange) {
          const competitionTimeRangeResult = await createCompetitionTimeRange.execute(data);

          match(competitionTimeRangeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-time-ranges/${data.id}`);
            },
          });
        } else {
          const competitionTimeRangeResult = await updateCompetitionTimeRange.execute(
            competitionTimeRange.id,
            data,
          );

          match(competitionTimeRangeResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-time-ranges/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition time range form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={competitionTimeRange ? `Edit ${name}` : 'Create Competition Time Range'}
        backUrl={
          competitionTimeRange
            ? `/competition-time-ranges/${competitionTimeRange.id}`
            : '/competition-time-ranges'
        }
      >
        <CompetitionTimeRangeToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
