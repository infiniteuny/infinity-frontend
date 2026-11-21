'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionScale } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionScaleInput } from './competition-scale-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionScale = useMemo(
    () => clientContainer.get<DeleteCompetitionScale>(SYMBOLS.DeleteCompetitionScale),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionScaleId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-scale'].some((p) => userPermissions.has(p))}
        editHref={`/competition-scales/${competitionScaleId}/edit`}
        canDelete={userPermissions.has('delete-competition-scale')}
        entityName="competition scale"
        onDelete={() => deleteCompetitionScale.execute(competitionScaleId)}
        deleteRedirectHref={'/competition-scales'}
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
