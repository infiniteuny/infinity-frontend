'use client';

import { CompetitionInstanceInput } from './competition-instance-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionInstanceId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionInstanceInput>;
};

export function CompetitionInstanceToolbar({
  competitionInstanceId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionInstanceId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition'].some((p) => userPermissions.has(p))}
        editHref={`/competitions/${competitionInstanceId}/edit`}
        editAriaLabel="Edit competition"
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
        saveAriaLabel="Save competition"
      />
    );
  } else {
    return null;
  }
}
