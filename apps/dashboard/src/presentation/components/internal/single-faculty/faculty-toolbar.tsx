'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteFaculty } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { FacultyInput } from './faculty-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  facultyId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<FacultyInput>;
};

export function FacultyToolbar({ facultyId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const deleteFaculty = useMemo(
    () => clientContainer.get<DeleteFaculty>(SYMBOLS.DeleteFaculty),
    [],
  );
  const userPermissions = useUserPermissions();

  if (facultyId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-faculty'].some((p) => userPermissions.has(p))}
        editHref={`/faculties/${facultyId}/edit`}
        editAriaLabel="Edit faculty"
        canDelete={userPermissions.has('delete-faculty')}
        deleteAriaLabel={'Delete faculty'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this faculty? This action cannot be undone.'
        }
        onDelete={() => deleteFaculty.execute(facultyId)}
        deleteRedirectHref={'/faculties'}
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
        saveAriaLabel="Save faculty"
      />
    );
  } else {
    return null;
  }
}
