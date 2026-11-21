'use client';

import { clientContainer } from '@app/client-injection';
import { DeletePermission } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { PermissionInput } from './permission-form';
import { RefObject, useMemo } from 'react';
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
  const deletePermission = useMemo(
    () => clientContainer.get<DeletePermission>(SYMBOLS.DeletePermission),
    [],
  );
  const userPermissions = useUserPermissions();

  if (permissionId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-permission'].some((p) => userPermissions.has(p))}
        editHref={`/permissions/${permissionId}/edit`}
        canDelete={userPermissions.has('delete-permission')}
        entityName="permission"
        onDelete={() => deletePermission.execute(permissionId)}
        deleteRedirectHref={'/permissions'}
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
