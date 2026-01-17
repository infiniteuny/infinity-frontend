import { Either } from 'effect/Either';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
} from '@app/domain/entities';

export interface ProjectGalleryRepository {
  getProjectGalleries(
    filterOptions?: ProjectGalleryFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>>;

  getProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>>;

  createProjectGallery(
    projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>>;

  updateProjectGallery(
    id: string,
    projectGallery: Partial<Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>>;

  deleteProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>>;
}
