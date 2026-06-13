import { Either } from 'effect/Either';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
  ProjectGallerySortOptions,
} from '@app/domain/entities';

export interface ProjectGalleryRepository {
  getProjectGalleries(
    filterOptions?: ProjectGalleryFilterOptions,
    sortOptions?: ProjectGallerySortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>>;

  getProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<ProjectGallery, Error>>;

  createProjectGallery(
    projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<ProjectGallery, Error>>;

  updateProjectGallery(
    id: string,
    projectGallery: Partial<Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<ProjectGallery, Error>>;

  deleteProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<ProjectGallery, Error>>;
}
