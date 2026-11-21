'use client';

import { PersonaInput } from './persona-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  personaId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<PersonaInput>;
};

export function PersonaToolbar({ personaId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (personaId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-persona'].some((p) => userPermissions.has(p))}
        editHref={`/personas/${personaId}/edit`}
        editAriaLabel="Edit persona"
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
        saveAriaLabel="Save persona"
      />
    );
  } else {
    return null;
  }
}
