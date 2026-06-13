import type { ProjectGalleryRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
  ProjectGallerySortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetProjectGalleriesParams = [
  filterOptions?: ProjectGalleryFilterOptions,
  sortOptions?: ProjectGallerySortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetProjectGalleries implements UseCase<
  Promise<Either<[ProjectGallery[], PaginationOptions], Error>>,
  GetProjectGalleriesParams
> {
  private readonly projectGalleryRepository: ProjectGalleryRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.ProjectGalleryRepository)
    projectGalleryRepository: ProjectGalleryRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.projectGalleryRepository = projectGalleryRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: ProjectGalleryFilterOptions,
    sortOptions?: ProjectGallerySortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.projectGalleryRepository.getProjectGalleries(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
