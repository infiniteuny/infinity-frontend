'use client';

import { CoreTeamMemberInput } from './core-team-member-form';
import { RefObject } from 'react';
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
  const userPermissions = useUserPermissions();

  if (coreTeamId && coreTeamMemberId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-core-team-member'].some((p) => userPermissions.has(p))}
        editHref={`/core-teams/${coreTeamId}/members/${coreTeamMemberId}/edit`}
        editAriaLabel="Edit core team member"
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
