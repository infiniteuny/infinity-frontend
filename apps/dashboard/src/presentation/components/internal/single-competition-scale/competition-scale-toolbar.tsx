'use client';

import { CompetitionScaleInput } from './competition-scale-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionScaleId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionScaleInput>;
};

export function CompetitionScaleToolbar({
  competitionScaleId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionScaleId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-scale'].some((p) => userPermissions.has(p))}
        editHref={`/competition-scales/${competitionScaleId}/edit`}
        editAriaLabel="Edit competition scale"
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
        saveAriaLabel="Save competition scale"
      />
    );
  } else {
    return null;
  }
}
