'use client';

import { CompetitionOrganizerTypeInput } from './competition-organizer-type-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionOrganizerTypeId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionOrganizerTypeInput>;
};

export function CompetitionOrganizerTypeToolbar({
  competitionOrganizerTypeId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionOrganizerTypeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-organizer-type'].some((p) => userPermissions.has(p))}
        editHref={`/competition-organizer-types/${competitionOrganizerTypeId}/edit`}
        editAriaLabel="Edit competition organizer type"
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
        saveAriaLabel="Save competition organizer type"
      />
    );
  } else {
    return null;
  }
}
