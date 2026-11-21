'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCommunityGroup } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CommunityGroupInput } from './community-group-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCommunityGroup = useMemo(
    () => clientContainer.get<DeleteCommunityGroup>(SYMBOLS.DeleteCommunityGroup),
    [],
  );
  const userPermissions = useUserPermissions();

  if (communityGroupId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-community-group'].some((p) => userPermissions.has(p))}
        editHref={`/community-groups/${communityGroupId}/edit`}
        editAriaLabel="Edit community group"
        canDelete={userPermissions.has('delete-community-group')}
        deleteAriaLabel={'Delete community group'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this community group? This action cannot be undone.'
        }
        onDelete={() => deleteCommunityGroup.execute(communityGroupId)}
        deleteRedirectHref={'/community-groups'}
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
