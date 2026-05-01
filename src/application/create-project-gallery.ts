import type { ProjectGalleryRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { ProjectGallery } from '@app/domain/entities';

export type CreateProjectGalleryParams = [
  projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateProjectGallery implements UseCase<
  Promise<Either<ProjectGallery, Error>>,
  CreateProjectGalleryParams
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
    projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<ProjectGallery, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.projectGalleryRepository.createProjectGallery(
        projectGallery,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
