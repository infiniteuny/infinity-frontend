'use client';

import { MajorInput } from './major-form';
import { RefObject } from 'react';
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
  const userPermissions = useUserPermissions();

  if (majorId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-major'].some((p) => userPermissions.has(p))}
        editHref={`/majors/${majorId}/edit`}
        editAriaLabel="Edit major"
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
