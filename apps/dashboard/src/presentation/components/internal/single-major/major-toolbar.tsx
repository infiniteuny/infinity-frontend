'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteMajor } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { MajorInput } from './major-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  majorId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<MajorInput>;
};

export function MajorToolbar({ majorId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const deleteMajor = useMemo(() => clientContainer.get<DeleteMajor>(SYMBOLS.DeleteMajor), []);
  const userPermissions = useUserPermissions();

  if (majorId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-major'].some((p) => userPermissions.has(p))}
        editHref={`/majors/${majorId}/edit`}
        editAriaLabel="Edit major"
        canDelete={userPermissions.has('delete-major')}
        deleteAriaLabel={'Delete major'}
        deleteConfirmDescription={
          'Are you sure you want to permanently delete this major? This action cannot be undone.'
        }
        onDelete={() => deleteMajor.execute(majorId)}
        deleteRedirectHref={'/majors'}
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
        saveAriaLabel="Save major"
      />
    );
  } else {
    return null;
  }
}
