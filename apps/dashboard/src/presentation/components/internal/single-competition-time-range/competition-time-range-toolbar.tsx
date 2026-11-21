'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionTimeRange } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeInput } from './competition-time-range-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionTimeRange = useMemo(
    () => clientContainer.get<DeleteCompetitionTimeRange>(SYMBOLS.DeleteCompetitionTimeRange),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionTimeRangeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-time-range'].some((p) => userPermissions.has(p))}
        editHref={`/competition-time-ranges/${competitionTimeRangeId}/edit`}
        editAriaLabel="Edit competition time range"
        canDelete={userPermissions.has('delete-competition-time-range')}
        deleteAriaLabel={'Delete competition time range'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this competition time range? This action cannot be undone.'
        }
        onDelete={() => deleteCompetitionTimeRange.execute(competitionTimeRangeId)}
        deleteRedirectHref={'/competition-time-ranges'}
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
