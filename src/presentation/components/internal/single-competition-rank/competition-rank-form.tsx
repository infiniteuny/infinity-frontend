'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionRank, UpdateCompetitionRank } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionRankDto, CompetitionRankMapper } from '@app/infrastructure/dtos';
import { CompetitionRankToolbar } from './competition-rank-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const competitionRankInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  weight: z.number('Weight must be a number').min(0, 'Weight must be non-negative'),
});

export type CompetitionRankInput = z.infer<typeof competitionRankInputSchema>;

type Props = {
  initialCompetitionRank?: CompetitionRankDto;
};

export function CompetitionRankForm({ initialCompetitionRank }: Props) {
  const createCompetitionRank = useMemo(
    () => clientContainer.get<CreateCompetitionRank>(SYMBOLS.CreateCompetitionRank),
    [],
  );
  const updateCompetitionRank = useMemo(
    () => clientContainer.get<UpdateCompetitionRank>(SYMBOLS.UpdateCompetitionRank),
    [],
  );
  const router = useRouter();

  const competitionRank = initialCompetitionRank
    ? CompetitionRankMapper.fromDtoToDomain(initialCompetitionRank)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionRankInput>({
    mode: 'all',
    resolver: zodResolver(competitionRankInputSchema) as Resolver<CompetitionRankInput>,
    defaultValues: competitionRank
      ? {
          ...competitionRank,
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
        if (!competitionRank) {
          const competitionRankResult = await createCompetitionRank.execute(data);

          match(competitionRankResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-ranks/${data.id}`);
            },
          });
        } else {
          const competitionRankResult = await updateCompetitionRank.execute(
            competitionRank.id,
            data,
          );

          match(competitionRankResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competition-ranks/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition rank form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={competitionRank ? name : 'Create Competition Rank'}>
        <CompetitionRankToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
