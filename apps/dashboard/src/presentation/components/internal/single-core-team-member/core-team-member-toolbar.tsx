'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCoreTeamMember } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CoreTeamMemberInput } from './core-team-member-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  coreTeamId: string;
  coreTeamMemberId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CoreTeamMemberInput>;
};

export function CoreTeamMemberToolbar({
  coreTeamId,
  coreTeamMemberId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const deleteCoreTeamMember = useMemo(
    () => clientContainer.get<DeleteCoreTeamMember>(SYMBOLS.DeleteCoreTeamMember),
    [],
  );
  const userPermissions = useUserPermissions();

  if (coreTeamId && coreTeamMemberId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-core-team-member'].some((p) => userPermissions.has(p))}
        editHref={`/core-teams/${coreTeamId}/members/${coreTeamMemberId}/edit`}
        editAriaLabel="Edit core team member"
        canDelete={userPermissions.has('delete-core-team-member')}
        deleteAriaLabel={'Delete core team member'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this member? This action cannot be undone.'
        }
        onDelete={() => deleteCoreTeamMember.execute(coreTeamMemberId)}
        deleteRedirectHref={`/core-teams/${coreTeamId}/members`}
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
        saveAriaLabel="Save core team member"
      />
    );
  } else {
    return null;
  }
}
