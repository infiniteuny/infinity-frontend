'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCommunityGroupAdmin } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CommunityGroupAdminInput } from './community-group-admin-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  communityGroupAdminId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CommunityGroupAdminInput>;
};

export function CommunityGroupAdminToolbar({
  communityGroupAdminId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const deleteCommunityGroupAdmin = useMemo(
    () => clientContainer.get<DeleteCommunityGroupAdmin>(SYMBOLS.DeleteCommunityGroupAdmin),
    [],
  );
  const userPermissions = useUserPermissions();

  if (communityGroupAdminId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-community-group-admin'].some((p) => userPermissions.has(p))}
        editHref={`/community-group-admins/${communityGroupAdminId}/edit`}
        editAriaLabel="Edit community group administrator"
        canDelete={userPermissions.has('delete-community-group-admin')}
        deleteAriaLabel={'Delete community group administrator'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this community group administrator? This action cannot be undone.'
        }
        onDelete={() => deleteCommunityGroupAdmin.execute(communityGroupAdminId)}
        deleteRedirectHref={'/community-group-admins'}
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
        saveAriaLabel="Save community group administrator"
      />
    );
  } else {
    return null;
  }
}
