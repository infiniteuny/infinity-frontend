'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateProjectGallery, UpdateProjectGallery } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@app/infrastructure/dtos';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectGalleryToolbar } from './project-gallery-toolbar';

const projectGalleryInputSchema = z.object({
  title: z.string().min(1, 'Title must not be empty'),
  description: z.string().min(1, 'Description must not be empty'),
  url: z.url({ protocol: /^https$/, error: 'URL must be a valid HTTPS URL' }),
  image: z.union([
    z
      .file('Image must not be empty')
      .mime(['image/png', 'image/jpeg', 'image/webp'], 'Image must be a PNG, JPEG, or WebP file')
      .max(5120 * 1024, 'Image must be less than 5MB'),
    z.string(),
  ]),
});

export type ProjectGalleryInput = z.infer<typeof projectGalleryInputSchema>;

type Props = {
  initialProjectGallery?: ProjectGalleryDto;
};

export function ProjectGalleryForm({ initialProjectGallery }: Props) {
  const createProjectGallery = useMemo(
    () => clientContainer.get<CreateProjectGallery>(SYMBOLS.CreateProjectGallery),
    [],
  );
  const updateProjectGallery = useMemo(
    () => clientContainer.get<UpdateProjectGallery>(SYMBOLS.UpdateProjectGallery),
    [],
  );
  const router = useRouter();

  const projectGallery = initialProjectGallery
    ? ProjectGalleryMapper.fromDtoToDomain(initialProjectGallery)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<ProjectGalleryInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(projectGalleryInputSchema) as Resolver<ProjectGalleryInput>,
    defaultValues: projectGallery
      ? {
          ...projectGallery,
        }
      : {
          title: '',
          description: '',
          url: '',
          image: undefined,
        },
  });

  const { handleSubmit: submit, watch, formState } = methods;

  const name = watch('title');

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!projectGallery) {
          const projectGalleryResult = await createProjectGallery.execute({
            ...data,
            image: data.image as File,
          });

          match(projectGalleryResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/project-galleries/${data.id}`);
            },
          });
        } else {
          const projectGalleryResult = await updateProjectGallery.execute(projectGallery.id, data);

          match(projectGalleryResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/project-galleries/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting project gallery form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={projectGallery ? name : 'Create Project Gallery'}>
        <ProjectGalleryToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
