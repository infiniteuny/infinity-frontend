import type { ProjectGalleryRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetProjectGalleriesParams = [
  filterOptions?: ProjectGalleryFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetProjectGalleries
  implements
    UseCase<
      Promise<Either<[ProjectGallery[], PaginationOptions], Error>>,
      GetProjectGalleriesParams
    >
{
  private readonly projectGalleryRepository: ProjectGalleryRepository;

  public constructor(
    @inject(SYMBOLS.ProjectGalleryRepository)
    projectGalleryRepository: ProjectGalleryRepository,
  ) {
    this.projectGalleryRepository = projectGalleryRepository;
  }

  public async execute(
    filterOptions?: ProjectGalleryFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>> {
    return await this.projectGalleryRepository.getProjectGalleries(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
