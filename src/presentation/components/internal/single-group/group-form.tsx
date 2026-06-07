'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateGroup, UpdateGroup } from '@app/application';
import { GeneralForm } from './general-form';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GroupToolbar } from './group-toolbar';

const groupInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  guardName: z.enum(['api'], 'Guard name must be one of "api"'),
});

export type GroupInput = z.infer<typeof groupInputSchema>;

type Props = {
  initialGroup?: GroupDto;
};

export function GroupForm({ initialGroup }: Props) {
  const createGroup = useMemo(() => clientContainer.get<CreateGroup>(SYMBOLS.CreateGroup), []);
  const updateGroup = useMemo(() => clientContainer.get<UpdateGroup>(SYMBOLS.UpdateGroup), []);
  const router = useRouter();

  const group = initialGroup ? GroupMapper.fromDtoToDomain(initialGroup) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<GroupInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(groupInputSchema) as Resolver<GroupInput>,
    defaultValues: group
      ? {
          ...group,
        }
      : {
          name: '',
          guardName: 'api',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    try {
      if (!group) {
        const groupResult = await createGroup.execute(data);

        match(groupResult, {
          onLeft: (error) => {
            throw error;
          },
          onRight: (result) => {
            router.push(`/groups/${result.id}`);
          },
        });
      } else {
        const groupResult = await updateGroup.execute(group.id, data);

        match(groupResult, {
          onLeft: (error) => {
            throw error;
          },
          onRight: (result) => {
            router.push(`/groups/${result.id}`);
          },
        });
      }
    } catch (error) {
      console.error('Error submitting group form:', error);
    }
  });

  return (
    <>
      <SectionHeader
        title={group ? `Edit ${name}` : 'Create Group'}
        backUrl={group ? `/groups/${group.id}` : '/groups'}
      >
        <GroupToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
