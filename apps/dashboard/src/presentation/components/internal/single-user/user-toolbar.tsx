'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteUser } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserDto, UserMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { UserInput } from './user-form';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  user: UserDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<UserInput>;
};

export function UserToolbar({ user, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const deleteUser = useMemo(() => clientContainer.get<DeleteUser>(SYMBOLS.DeleteUser), []);
  const session = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();
  const parsedUser = useMemo(() => (user ? UserMapper.fromDtoToDomain(user) : undefined), [user]);

  if (user && parsedUser) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={
          userPermissions.has('update-user') ||
          (userPermissions.has('update-own-user') && parsedUser.id === session?.user.id)
        }
        editHref={`/users/${parsedUser.id}/edit`}
        entityName="user"
        entityDisplayName={parsedUser.name}
        canDelete={userPermissions.has('delete-user') && parsedUser.id !== session?.user.id}
        onDelete={() => deleteUser.execute(parsedUser.id)}
        deleteRedirectHref={'/users'}
      />
    );
  } else if (ref && methods) {
    const {
      formState: { isDirty, isSubmitting },
    } = methods;

    return (
      <SingleEntityToolbar
        mode="form"
        formRef={ref}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        saveAriaLabel="Save user"
      />
    );
  } else {
    return null;
  }
}
