'use client';

import { CommunityGroupAdminInput } from './community-group-admin-form';
import { RefObject } from 'react';
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
  const userPermissions = useUserPermissions();

  if (communityGroupAdminId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-community-group-admin'].some((p) => userPermissions.has(p))}
        editHref={`/community-group-admins/${communityGroupAdminId}/edit`}
        editAriaLabel="Edit community group administrator"
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
