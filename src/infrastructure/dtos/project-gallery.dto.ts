import { DateTime } from 'luxon';
import { ProjectGallery } from '@app/domain/entities';

export interface ProjectGalleryDto {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export class ProjectGalleryMapper {
  public static fromDomaintoDto(
    projectGallery: Partial<ProjectGallery>,
  ): Partial<ProjectGalleryDto> {
    return {
      id: projectGallery.id,
      title: projectGallery.title,
      description: projectGallery.description,
      url: projectGallery.url,
      image: projectGallery.image,
      created_at: projectGallery.createdAt?.toISOString(),
      updated_at: projectGallery.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(projectGalleryDto: ProjectGalleryDto): ProjectGallery {
    return new ProjectGallery(
      projectGalleryDto.id,
      projectGalleryDto.title,
      projectGalleryDto.description,
      projectGalleryDto.url,
      projectGalleryDto.image,
      DateTime.fromISO(projectGalleryDto.created_at).toJSDate(),
      DateTime.fromISO(projectGalleryDto.updated_at).toJSDate(),
    );
  }
}
