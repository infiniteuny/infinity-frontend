import { GetProjectGallery, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@app/infrastructure/dtos';
import {
  ProjectGalleryForm,
  ProjectGalleryToolbar,
  ProjectGalleryView,
} from '@app/presentation/components/internal/single-project-gallery';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    projectGalleryId: string;
  }>;
};

export default async function SingleProjectGalleryPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const projectGalleryId = (await params).projectGalleryId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (projectGalleryId !== 'new') {
    const getProjectGallery = serverContainer.get<GetProjectGallery>(SYMBOLS.GetProjectGallery);
    const projectGalleryResult = await getProjectGallery.execute(projectGalleryId);
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
      <>
        <SectionHeader title={projectGallery.title}>
          <ProjectGalleryToolbar projectGalleryId={projectGallery.id} />
        </SectionHeader>
        <ProjectGalleryView
          initialProjectGallery={
            ProjectGalleryMapper.fromDomainToDto(projectGallery) as ProjectGalleryDto
          }
        />
      </>
    );
  } else if (
    projectGalleryId === 'new' &&
    ['create-project-gallery'].some((p) => userPermissions.has(p))
  ) {
    return <ProjectGalleryForm />;
  } else {
    notFound();
  }
}
