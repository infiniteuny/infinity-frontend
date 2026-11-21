'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetition } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionInput } from './competition-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetition = useMemo(
    () => clientContainer.get<DeleteCompetition>(SYMBOLS.DeleteCompetition),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition'].some((p) => userPermissions.has(p))}
        editHref={`/competition-series/${competitionId}/edit`}
        editAriaLabel="Edit competition series"
        canDelete={userPermissions.has('delete-competition')}
        deleteAriaLabel={'Delete competition series'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this competition series? This action cannot be undone.'
        }
        onDelete={() => deleteCompetition.execute(competitionId)}
        deleteRedirectHref={'/competition-series'}
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
