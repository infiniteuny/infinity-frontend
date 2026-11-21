'use client';

import { CoreTeamInput } from './core-team-form';
import { UseFormReturn } from 'react-hook-form';
import { RefObject } from 'react';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  coreTeamId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CoreTeamInput>;
};

export function CoreTeamToolbar({ coreTeamId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (coreTeamId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-core-team'].some((p) => userPermissions.has(p))}
        editHref={`/core-teams/${coreTeamId}/edit`}
        editAriaLabel="Edit core team"
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
        saveAriaLabel="Save core team"
      />
    );
  } else {
    return null;
  }
}
