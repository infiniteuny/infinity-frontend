'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import { CoreTeamToolbar } from './core-team-toolbar';
import { CreateCoreTeam, UpdateCoreTeam } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const coreTeamInputSchema = z
  .object({
    _new: z.boolean(),
    _initial: z.boolean(),
    year: z.number('Year must be a number').int('Year must be an integer').min(2014).max(9999),
    isActive: z.boolean(),
  })
  .refine((data) => data.isActive || data._new || (!data._new && !data._initial), {
    message:
      'Active core team cannot be deactivated, please set another as active to deactivate this one.',
    path: ['isActive'],
    when: (payload) => {
      return coreTeamInputSchema.pick({ isActive: true }).safeParse(payload.value).success;
    },
  });

export type CoreTeamInput = z.infer<typeof coreTeamInputSchema>;

type Props = {
  initialCoreTeam?: CoreTeamDto;
};

export function CoreTeamForm({ initialCoreTeam }: Props) {
  const createCoreTeam = useMemo(
    () => clientContainer.get<CreateCoreTeam>(SYMBOLS.CreateCoreTeam),
    [],
  );
  const updateCoreTeam = useMemo(
    () => clientContainer.get<UpdateCoreTeam>(SYMBOLS.UpdateCoreTeam),
    [],
  );
  const router = useRouter();

  const coreTeam = initialCoreTeam ? CoreTeamMapper.fromDtoToDomain(initialCoreTeam) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CoreTeamInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(coreTeamInputSchema) as Resolver<CoreTeamInput>,
    defaultValues: coreTeam
      ? {
          ...coreTeam,
          _new: false,
          _initial: coreTeam.isActive,
        }
      : {
          year: undefined,
          isActive: false,
          _new: true,
          _initial: false,
        },
  });

  const { handleSubmit: submit, watch, formState } = methods;

  const name = watch('year');

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!coreTeam) {
          const coreTeamResult = await createCoreTeam.execute(data);

          match(coreTeamResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/core-teams/${data.id}`);
            },
          });
        } else {
          const coreTeamResult = await updateCoreTeam.execute(coreTeam.id, data);

          match(coreTeamResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/core-teams/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting core team form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={coreTeam ? name.toString() : 'Create Core Team'}>
        <CoreTeamToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
