'use client';

import { DegreeInput } from './degree-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  degreeId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<DegreeInput>;
};

export function DegreeToolbar({ degreeId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (degreeId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-degree'].some((p) => userPermissions.has(p))}
        editHref={`/degrees/${degreeId}/edit`}
        editAriaLabel="Edit degree"
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
        saveAriaLabel="Save degree"
      />
    );
  } else {
    return null;
  }
}
