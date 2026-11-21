'use client';

import { RefObject } from 'react';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';
import { UserPersonaInput } from './user-persona-form';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<UserPersonaInput>;
};

export function UserPersonaToolbar({ ref, methods }: Props) {
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <SingleEntityToolbar
      mode="form"
      formRef={ref}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      saveAriaLabel="Save user persona"
    />
  );
}
