'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreatePermission, UpdatePermission } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { PermissionDto, PermissionMapper } from '@app/infrastructure/dtos';
import { PermissionToolbar } from './permission-toolbar';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const permissionInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  guardName: z.enum(['api'], 'Guard name must be one of "api"'),
});

export type PermissionInput = z.infer<typeof permissionInputSchema>;

type Props = {
  initialPermission?: PermissionDto;
};

export function PermissionForm({ initialPermission }: Props) {
  const createPermission = useMemo(
    () => clientContainer.get<CreatePermission>(SYMBOLS.CreatePermission),
    [],
  );
  const updatePermission = useMemo(
    () => clientContainer.get<UpdatePermission>(SYMBOLS.UpdatePermission),
    [],
  );
  const router = useRouter();

  const permission = initialPermission ? PermissionMapper.fromDtoToDomain(initialPermission) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<PermissionInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(permissionInputSchema) as Resolver<PermissionInput>,
    defaultValues: permission
      ? {
          ...permission,
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
      if (!permission) {
        const permissionResult = await createPermission.execute(data);

        match(permissionResult, {
          onLeft: (error) => {
            throw error;
          },
          onRight: (data) => {
            router.push(`/permissions/${data.id}`);
          },
        });
      } else {
        const permissionResult = await updatePermission.execute(permission.id, data);

        match(permissionResult, {
          onLeft: (error) => {
            throw error;
          },
          onRight: (data) => {
            router.push(`/permissions/${data.id}`);
          },
        });
      }
    } catch (error) {
      console.error('Error submitting permission form:', error);
    }
  });

  return (
    <>
      <SectionHeader title={permission ? name : 'Create Permission'}>
        <PermissionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
