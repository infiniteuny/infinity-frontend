'use client';

import { CommunityGroupInput } from './community-group-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  communityGroupId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CommunityGroupInput>;
};

export function CommunityGroupToolbar({
  communityGroupId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (communityGroupId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-community-group'].some((p) => userPermissions.has(p))}
        editHref={`/community-groups/${communityGroupId}/edit`}
        editAriaLabel="Edit community group"
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
        saveAriaLabel="Save community group"
      />
    );
  } else {
    return null;
  }
}
