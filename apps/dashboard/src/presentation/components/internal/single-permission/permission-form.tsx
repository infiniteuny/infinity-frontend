'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreatePermission, UpdatePermission } from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/presentation/utils';
import { match } from 'effect/Either';
import { PermissionDto, PermissionMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { PermissionToolbar } from './permission-toolbar';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
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
          name: permission.name,
          guardName: permission.guardName,
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
            handleFormError(error, methods, 'Failed to create permission.');
          },
          onRight: (data) => {
            toast.success('Permission created successfully.');
            router.push(`/permissions/${data.id}`);
          },
        });
      } else {
        const permissionResult = await updatePermission.execute(permission.id, data);

        match(permissionResult, {
          onLeft: (error) => {
            handleFormError(error, methods, 'Failed to update permission.');
          },
          onRight: (data) => {
            toast.success('Permission updated successfully.');
            router.push(`/permissions/${data.id}`);
          },
        });
      }
    } catch (error) {
      handleFormError(error, methods, 'Failed to save permission.');
    }
  });

  return (
    <>
      <SectionHeader
        title={permission ? `Edit ${name}` : 'Create Permission'}
        backUrl={permission ? `/permissions/${permission.id}` : '/permissions'}
      >
        <PermissionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
