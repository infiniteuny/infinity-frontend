'use client';

import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserDto, UserMapper } from '@infiniteuny/infinity-infrastructure';
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
        editAriaLabel="Edit user"
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
