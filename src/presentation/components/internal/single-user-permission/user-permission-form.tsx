'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateUserPermission } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { UserPermissionToolbar } from './user-permission-toolbar';
import { useMemo, useRef } from 'react';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
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

    const result = await createUserPermission.execute(parsedUser.id, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(
          isProfileForm ? `/settings/profile/permissions` : `/users/${parsedUser.id}/permissions`,
        );
      },
    });
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
