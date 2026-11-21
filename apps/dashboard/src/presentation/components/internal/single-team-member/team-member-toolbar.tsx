'use client';

import { RefObject } from 'react';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';
import { TeamMemberInput } from './team-member-form';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<TeamMemberInput>;
};

export function TeamMemberToolbar({ ref, methods }: Props) {
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <SingleEntityToolbar
      mode="form"
      formRef={ref}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      saveAriaLabel="Save team member"
    />
  );
}
