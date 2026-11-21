'use client';

import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { UserInput } from '@app/presentation/components/internal/single-user';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  userId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<UserInput>;
};

export function ProfileToolbar({ userId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (userId) {
    return (
      <SingleEntityToolbar
        mode="view"
        entityName="profile"
        canEdit={['update-own-user'].some((p) => userPermissions.has(p))}
        editHref={`/settings/profile/edit`}
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
        saveAriaLabel="Save profile"
      />
    );
  } else {
    return null;
  }
}
