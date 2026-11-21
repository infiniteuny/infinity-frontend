'use client';

import { RefObject } from 'react';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';
import { UseFormReturn } from 'react-hook-form';
import { CommunityGroupMemberInput } from './community-group-member-form';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CommunityGroupMemberInput>;
};

export function CommunityGroupMemberToolbar({ ref, methods }: Props) {
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <SingleEntityToolbar
      mode="form"
      formRef={ref}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      saveAriaLabel="Save community group member"
    />
  );
}
