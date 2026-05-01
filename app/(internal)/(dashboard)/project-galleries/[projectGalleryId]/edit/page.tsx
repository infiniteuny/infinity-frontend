import { GetProjectGallery } from '@app/application';
import { match } from 'effect/Either';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@app/infrastructure/dtos';
import { ProjectGalleryForm } from '@app/presentation/components/internal/single-project-gallery';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    projectGalleryId: string;
  }>;
};

export default async function SingleProjectGalleryEditPage({ params }: Props) {
  const getProjectGallery = serverContainer.get<GetProjectGallery>(SYMBOLS.GetProjectGallery);
  const projectGalleryId = (await params).projectGalleryId;

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
    <ProjectGalleryForm
      initialProjectGallery={
        ProjectGalleryMapper.fromDomainToDto(projectGallery) as ProjectGalleryDto
      }
    />
  );
}
