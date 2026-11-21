'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionInstance } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionInstanceInput } from './competition-instance-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionInstance = useMemo(
    () => clientContainer.get<DeleteCompetitionInstance>(SYMBOLS.DeleteCompetitionInstance),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionInstanceId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition'].some((p) => userPermissions.has(p))}
        editHref={`/competitions/${competitionInstanceId}/edit`}
        editAriaLabel="Edit competition"
        canDelete={userPermissions.has('delete-competition')}
        deleteAriaLabel={'Delete competition'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this competition? This action cannot be undone.'
        }
        onDelete={() => deleteCompetitionInstance.execute(competitionInstanceId)}
        deleteRedirectHref={'/competitions'}
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
