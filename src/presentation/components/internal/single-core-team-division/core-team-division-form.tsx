'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCoreTeamDivision, UpdateCoreTeamDivision } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import { CoreTeamDivisionToolbar } from './core-team-division-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const coreTeamDivisionInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  priority: z.number('Priority must be a number').min(0, 'Priority must be non-negative'),
});

export type CoreTeamDivisionInput = z.infer<typeof coreTeamDivisionInputSchema>;

type Props = {
  initialCoreTeamDivision?: CoreTeamDivisionDto;
};

export function CoreTeamDivisionForm({ initialCoreTeamDivision }: Props) {
  const createCoreTeamDivision = useMemo(
    () => clientContainer.get<CreateCoreTeamDivision>(SYMBOLS.CreateCoreTeamDivision),
    [],
  );
  const updateCoreTeamDivision = useMemo(
    () => clientContainer.get<UpdateCoreTeamDivision>(SYMBOLS.UpdateCoreTeamDivision),
    [],
  );
  const router = useRouter();

  const coreTeamDivision = initialCoreTeamDivision
    ? CoreTeamDivisionMapper.fromDtoToDomain(initialCoreTeamDivision)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CoreTeamDivisionInput>({
    mode: 'all',
    resolver: zodResolver(coreTeamDivisionInputSchema) as Resolver<CoreTeamDivisionInput>,
    defaultValues: coreTeamDivision
      ? {
          ...coreTeamDivision,
        }
      : {
          name: '',
          priority: 0,
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!coreTeamDivision) {
          const coreTeamDivisionResult = await createCoreTeamDivision.execute(data);

          match(coreTeamDivisionResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/core-team-divisions/${data.id}`);
            },
          });
        } else {
          const coreTeamDivisionResult = await updateCoreTeamDivision.execute(
            coreTeamDivision.id,
            data,
          );

          match(coreTeamDivisionResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/core-team-divisions/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting core team division form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={coreTeamDivision ? name : 'Create Core Team Division'}>
        <CoreTeamDivisionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
