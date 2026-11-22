'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateUserPermission } from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { UserPermissionToolbar } from './user-permission-toolbar';
import { handleFormError } from '@app/utils';
import { toast } from 'react-toastify';
import { useMemo, useRef } from 'react';
import { UserDto, UserMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userPermissionInputSchema = z.object({
  permissionId: z.uuidv7('Permission must be selected'),
});

export type UserPermissionInput = z.infer<typeof userPermissionInputSchema>;

type Props = {
  user: UserDto;
  isProfileForm?: boolean;
};

export function UserPermissionForm({ user, isProfileForm }: Props) {
  const createUserPermission = useMemo(
    () => clientContainer.get<CreateUserPermission>(SYMBOLS.CreateUserPermission),
    [],
  );
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UserPermissionInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(userPermissionInputSchema) as Resolver<UserPermissionInput>,
    defaultValues: {
      permissionId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    try {
      const result = await createUserPermission.execute(parsedUser.id, data);

      match(result, {
        onLeft: (error) => {
          handleFormError(error, methods, 'Failed to add permission.');
        },
        onRight: () => {
          toast.success('Permission added successfully.');
          router.push(
            isProfileForm ? `/settings/profile/permissions` : `/users/${parsedUser.id}/permissions`,
          );
        },
      });
    } catch (error) {
      handleFormError(error, methods, 'Failed to add permission.');
    }
  });

  return (
    <>
      <SectionHeader
        title={isProfileForm ? 'Add Permission' : `Add ${parsedUser.name}'s Permission`}
        backUrl={
          isProfileForm ? `/settings/profile/permissions` : `/users/${parsedUser.id}/permissions`
        }
      >
        <UserPermissionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
