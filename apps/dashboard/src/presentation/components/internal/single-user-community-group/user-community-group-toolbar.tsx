'use client';

import { RefObject } from 'react';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';
import { UserCommunityGroupInput } from './user-community-group-form';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<UserCommunityGroupInput>;
};

export function UserCommunityGroupToolbar({ ref, methods }: Props) {
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <SingleEntityToolbar
      mode="form"
      formRef={ref}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      saveAriaLabel="Save user community group"
    />
  );
}
