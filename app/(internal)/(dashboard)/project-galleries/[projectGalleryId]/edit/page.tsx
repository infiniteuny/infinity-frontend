import { cache } from 'react';
import { GetProjectGallery, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@app/infrastructure/dtos';
import { ProjectGalleryForm } from '@app/presentation/components/internal/single-project-gallery';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    projectGalleryId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const projectGalleryId = (await params).projectGalleryId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-project-gallery'].some((p) => userPermissions.has(p))) {
    const getProjectGallery = serverContainer.get<GetProjectGallery>(SYMBOLS.GetProjectGallery);

    const projectGalleryResult = await cache(
      async () => await getProjectGallery.execute(projectGalleryId),
    )();
    const projectGallery = match(projectGalleryResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return { title: `Edit ${projectGallery.title}` };
  } else {
    notFound();
  }
}

export default async function SingleProjectGalleryEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-project-gallery'].some((p) => userPermissions.has(p))) {
    const getProjectGallery = serverContainer.get<GetProjectGallery>(SYMBOLS.GetProjectGallery);
    const projectGalleryId = (await params).projectGalleryId;

    const projectGalleryResult = await cache(
      async () => await getProjectGallery.execute(projectGalleryId),
    )();
    const projectGallery = match(projectGalleryResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Project Galleries', url: '/project-galleries' },
          { label: projectGallery.title, url: `/project-galleries/${projectGallery.id}` },
          { label: 'Edit', url: `/project-galleries/${projectGallery.id}/edit` },
        ]}
      >
        <ProjectGalleryForm
          initialProjectGallery={
            ProjectGalleryMapper.fromDomainToDto(projectGallery) as ProjectGalleryDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
