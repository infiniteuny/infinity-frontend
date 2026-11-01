'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { ProjectGalleryDto, ProjectGalleryMapper } from '@infiniteuny/infinity-infrastructure';

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
