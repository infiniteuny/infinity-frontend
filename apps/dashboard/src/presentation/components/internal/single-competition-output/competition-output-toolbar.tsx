'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionOutput } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionOutputInput } from './competition-output-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionOutput = useMemo(
    () => clientContainer.get<DeleteCompetitionOutput>(SYMBOLS.DeleteCompetitionOutput),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionOutputId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-output'].some((p) => userPermissions.has(p))}
        editHref={`/competition-outputs/${competitionOutputId}/edit`}
        editAriaLabel="Edit competition output"
        canDelete={userPermissions.has('delete-competition-output')}
        deleteAriaLabel={'Delete competition output'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this competition output? This action cannot be undone.'
        }
        onDelete={() => deleteCompetitionOutput.execute(competitionOutputId)}
        deleteRedirectHref={'/competition-outputs'}
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
