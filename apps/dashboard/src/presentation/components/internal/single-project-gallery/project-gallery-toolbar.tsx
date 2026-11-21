'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteProjectGallery } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { ProjectGalleryInput } from './project-gallery-form';
import { RefObject, useMemo } from 'react';
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
  const deleteProjectGallery = useMemo(
    () => clientContainer.get<DeleteProjectGallery>(SYMBOLS.DeleteProjectGallery),
    [],
  );
  const userPermissions = useUserPermissions();

  if (projectGalleryId) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-project-gallery'].some((p) => userPermissions.has(p))}
        editHref={`/project-galleries/${projectGalleryId}/edit`}
        canDelete={userPermissions.has('delete-project-gallery')}
        entityName="project gallery"
        onDelete={() => deleteProjectGallery.execute(projectGalleryId)}
        deleteRedirectHref={'/project-galleries'}
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
