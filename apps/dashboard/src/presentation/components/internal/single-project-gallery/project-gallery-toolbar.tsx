'use client';

import { ProjectGalleryInput } from './project-gallery-form';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  projectGalleryId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<ProjectGalleryInput>;
};

export function ProjectGalleryToolbar({
  projectGalleryId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const userPermissions = useUserPermissions();

  if (projectGalleryId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-project-gallery'].some((p) => userPermissions.has(p))}
        editHref={`/project-galleries/${projectGalleryId}/edit`}
        editAriaLabel="Edit project gallery"
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
        saveAriaLabel="Save project gallery"
      />
    );
  } else {
    return null;
  }
}
