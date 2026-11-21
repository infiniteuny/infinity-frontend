'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionTeamType } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionTeamTypeInput } from './competition-team-type-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  competitionTeamTypeId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CompetitionTeamTypeInput>;
};

export function CompetitionTeamTypeToolbar({
  competitionTeamTypeId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const deleteCompetitionTeamType = useMemo(
    () => clientContainer.get<DeleteCompetitionTeamType>(SYMBOLS.DeleteCompetitionTeamType),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionTeamTypeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-team-type'].some((p) => userPermissions.has(p))}
        editHref={`/team-types/${competitionTeamTypeId}/edit`}
        canDelete={userPermissions.has('delete-competition-team-type')}
        entityName="team type"
        onDelete={() => deleteCompetitionTeamType.execute(competitionTeamTypeId)}
        deleteRedirectHref={'/team-types'}
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
        saveAriaLabel="Save competition team type"
      />
    );
  } else {
    return null;
  }
}
