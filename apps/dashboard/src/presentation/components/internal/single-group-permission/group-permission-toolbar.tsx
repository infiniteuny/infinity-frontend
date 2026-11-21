'use client';

import { RefObject } from 'react';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';
import { GroupPermissionInput } from './group-permission-form';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<GroupPermissionInput>;
};

export function GroupPermissionToolbar({ ref, methods }: Props) {
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <SingleEntityToolbar
      mode="form"
      formRef={ref}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      saveAriaLabel="Save group permission"
    />
  );
}
