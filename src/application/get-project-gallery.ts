import type { ProjectGalleryRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { ProjectGallery } from '@app/domain/entities';

export type GetProjectGalleryParams = [
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetProjectGallery implements UseCase<
  Promise<Either<ProjectGallery, Error>>,
  GetProjectGalleryParams
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
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.projectGalleryRepository.getProjectGallery(id, abortSignal, accessToken);
  }
}
