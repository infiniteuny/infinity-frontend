'use client';

import { CompetitionTimeRangeInput } from './competition-time-range-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionTimeRangeId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionTimeRangeInput>;
};

export function CompetitionTimeRangeToolbar({
  competitionTimeRangeId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionTimeRangeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-time-range'].some((p) => userPermissions.has(p))}
        editHref={`/competition-time-ranges/${competitionTimeRangeId}/edit`}
        editAriaLabel="Edit competition time range"
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
        saveAriaLabel="Save competition time range"
      />
    );
  } else {
    return null;
  }
}
