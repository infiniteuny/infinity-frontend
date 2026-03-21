import { DateTime } from 'luxon';
import { ProjectGallery } from '@app/domain/entities';

export interface ProjectGalleryDto {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string | File;
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

  public static fromDtoToDomain(dto: ProjectGalleryDto): ProjectGallery {
    return new ProjectGallery(
      dto.id,
      dto.title,
      dto.description,
      dto.url,
      dto.image,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
