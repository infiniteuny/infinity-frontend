'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionOrganizerType } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionOrganizerTypeInput } from './competition-organizer-type-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionOrganizerType = useMemo(
    () =>
      clientContainer.get<DeleteCompetitionOrganizerType>(SYMBOLS.DeleteCompetitionOrganizerType),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionOrganizerTypeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-organizer-type'].some((p) => userPermissions.has(p))}
        editHref={`/competition-organizer-types/${competitionOrganizerTypeId}/edit`}
        canDelete={userPermissions.has('delete-competition-organizer-type')}
        entityName="competition organizer type"
        onDelete={() => deleteCompetitionOrganizerType.execute(competitionOrganizerTypeId)}
        deleteRedirectHref={'/competition-organizer-types'}
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
