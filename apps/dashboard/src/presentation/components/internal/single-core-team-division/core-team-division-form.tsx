'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCoreTeamDivision, UpdateCoreTeamDivision } from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/utils';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
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
          name: coreTeamDivision.name,
          priority: coreTeamDivision.priority,
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
              handleFormError(error, methods, 'Failed to create core team division.');
            },
            onRight: (data) => {
              toast.success('Core team division created successfully.');
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
              handleFormError(error, methods, 'Failed to update core team division.');
            },
            onRight: (data) => {
              toast.success('Core team division updated successfully.');
              router.push(`/core-team-divisions/${data.id}`);
            },
          });
        }
      } catch (error) {
        handleFormError(error, methods, 'Failed to save core team division.');
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={coreTeamDivision ? `Edit ${name}` : 'Create Core Team Division'}
        backUrl={
          coreTeamDivision ? `/core-team-divisions/${coreTeamDivision.id}` : '/core-team-divisions'
        }
      >
        <CoreTeamDivisionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
