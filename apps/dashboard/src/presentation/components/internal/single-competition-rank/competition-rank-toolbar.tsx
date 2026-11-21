'use client';

import { CompetitionRankInput } from './competition-rank-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionRankId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionRankInput>;
};

export function CompetitionRankToolbar({
  competitionRankId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (competitionRankId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-rank'].some((p) => userPermissions.has(p))}
        editHref={`/competition-ranks/${competitionRankId}/edit`}
        editAriaLabel="Edit competition rank"
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
        saveAriaLabel="Save competition rank"
      />
    );
  } else {
    return null;
  }
}
