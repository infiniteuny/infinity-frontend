'use client';

import { CompetitionInput } from './competition-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionInput>;
};

export function CompetitionToolbar({ competitionId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition'].some((p) => userPermissions.has(p))}
        editHref={`/competition-series/${competitionId}/edit`}
        editAriaLabel="Edit competition series"
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
        saveAriaLabel="Save competition series"
      />
    );
  } else {
    return null;
  }
}
