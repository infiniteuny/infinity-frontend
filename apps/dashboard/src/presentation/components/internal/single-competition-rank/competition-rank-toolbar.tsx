'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCompetitionRank } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CompetitionRankInput } from './competition-rank-form';
import { RefObject, useMemo } from 'react';
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
  const deleteCompetitionRank = useMemo(
    () => clientContainer.get<DeleteCompetitionRank>(SYMBOLS.DeleteCompetitionRank),
    [],
  );
  const userPermissions = useUserPermissions();

  if (competitionRankId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-competition-rank'].some((p) => userPermissions.has(p))}
        editHref={`/competition-ranks/${competitionRankId}/edit`}
        editAriaLabel="Edit competition rank"
        canDelete={userPermissions.has('delete-competition-rank')}
        deleteAriaLabel={'Delete competition rank'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this competition rank? This action cannot be undone.'
        }
        onDelete={() => deleteCompetitionRank.execute(competitionRankId)}
        deleteRedirectHref={'/competition-ranks'}
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
