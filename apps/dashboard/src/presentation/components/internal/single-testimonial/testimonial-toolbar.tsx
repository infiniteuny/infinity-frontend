'use client';

import { RefObject } from 'react';
import { TestimonialInput } from './testimonial-form';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  testimonialId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<TestimonialInput>;
};

export function TestimonialToolbar({ testimonialId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (testimonialId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-testimonial'].some((p) => userPermissions.has(p))}
        editHref={`/testimonials/${testimonialId}/edit`}
        editAriaLabel="Edit testimonial"
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
        saveAriaLabel="Save testimonial"
      />
    );
  } else {
    return null;
  }
}
