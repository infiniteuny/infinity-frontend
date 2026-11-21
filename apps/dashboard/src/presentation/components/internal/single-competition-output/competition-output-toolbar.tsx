'use client';

import { CompetitionOutputInput } from './competition-output-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionOutputId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionOutputInput>;
};

export function CompetitionOutputToolbar({
  competitionOutputId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionOutputId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-output'].some((p) => userPermissions.has(p))}
        editHref={`/competition-outputs/${competitionOutputId}/edit`}
        editAriaLabel="Edit competition output"
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
        saveAriaLabel="Save competition output"
      />
    );
  } else {
    return null;
  }
}
