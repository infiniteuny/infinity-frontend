'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCommunityGroupAdminMember } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CommunityGroupAdminMemberInput } from './community-group-admin-member-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  communityGroupAdminId: string;
  communityGroupAdminMemberId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CommunityGroupAdminMemberInput>;
};

export function CommunityGroupAdminMemberToolbar({
  communityGroupAdminId,
  communityGroupAdminMemberId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const deleteCommunityGroupAdminMember = useMemo(
    () =>
      clientContainer.get<DeleteCommunityGroupAdminMember>(SYMBOLS.DeleteCommunityGroupAdminMember),
    [],
  );
  const userPermissions = useUserPermissions();

  if (communityGroupAdminId && communityGroupAdminMemberId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-community-group-admin-member'].some((p) => userPermissions.has(p))}
        editHref={`/community-group-admins/${communityGroupAdminId}/members/${communityGroupAdminMemberId}/edit`}
        editAriaLabel="Edit community group admin member"
        canDelete={userPermissions.has('delete-community-group-admin-member')}
        deleteAriaLabel={'Delete community group administrator member'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this member? This action cannot be undone.'
        }
        onDelete={() => deleteCommunityGroupAdminMember.execute(communityGroupAdminMemberId)}
        deleteRedirectHref={`/community-group-admins/${communityGroupAdminId}/members`}
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
        saveAriaLabel="Save community group admin member"
      />
    );
  } else {
    return null;
  }
}
