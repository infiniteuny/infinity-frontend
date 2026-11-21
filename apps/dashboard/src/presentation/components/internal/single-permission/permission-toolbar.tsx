'use client';

import { PermissionInput } from './permission-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  permissionId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<PermissionInput>;
};

export function PermissionToolbar({ permissionId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (permissionId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-permission'].some((p) => userPermissions.has(p))}
        editHref={`/permissions/${permissionId}/edit`}
        editAriaLabel="Edit permission"
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
        saveAriaLabel="Save permission"
      />
    );
  } else {
    return null;
  }
}
