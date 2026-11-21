'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteCoreTeamDivision } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionInput } from './core-team-division-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  coreTeamDivisionId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CoreTeamDivisionInput>;
};

export function CoreTeamDivisionToolbar({
  coreTeamDivisionId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const deleteCoreTeamDivision = useMemo(
    () => clientContainer.get<DeleteCoreTeamDivision>(SYMBOLS.DeleteCoreTeamDivision),
    [],
  );
  const userPermissions = useUserPermissions();

  if (coreTeamDivisionId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-core-team-division'].some((p) => userPermissions.has(p))}
        editHref={`/core-team-divisions/${coreTeamDivisionId}/edit`}
        editAriaLabel="Edit core team division"
        canDelete={userPermissions.has('delete-core-team-division')}
        deleteAriaLabel={'Delete core team division'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this core team division? This action cannot be undone.'
        }
        onDelete={() => deleteCoreTeamDivision.execute(coreTeamDivisionId)}
        deleteRedirectHref={'/core-team-divisions'}
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
        saveAriaLabel="Save core team division"
      />
    );
  } else {
    return null;
  }
}
