'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@app/infrastructure/dtos';

type Props = {
  initialProjectGallery: ProjectGalleryDto;
};

export function ProjectGalleryView({ initialProjectGallery }: Props) {
  const projectGallery = ProjectGalleryMapper.fromDtoToDomain(initialProjectGallery);

  return (
    <>
      <GeneralView projectGallery={projectGallery} />
      <MetadataView projectGallery={projectGallery} />
    </>
  );
}
