import type { ProjectGalleryRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { ProjectGallery } from '@app/domain/entities';

export type DeleteProjectGalleryParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteProjectGallery implements UseCase<
  Promise<Either<ProjectGallery, Error>>,
  DeleteProjectGalleryParams
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
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<ProjectGallery, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.projectGalleryRepository.deleteProjectGallery(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
