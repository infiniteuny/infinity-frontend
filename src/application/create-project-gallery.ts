import type { ProjectGalleryRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { ProjectGallery } from '@app/domain/entities';

export type CreateProjectGalleryParams = [
  projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateProjectGallery implements UseCase<
  Promise<Either<ProjectGallery, Error>>,
  CreateProjectGalleryParams
> {
  private readonly projectGalleryRepository: ProjectGalleryRepository;

  public constructor(
    @inject(SYMBOLS.ProjectGalleryRepository)
    projectGalleryRepository: ProjectGalleryRepository,
  ) {
    this.projectGalleryRepository = projectGalleryRepository;
  }

  public async execute(
    projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>> {
    return await this.projectGalleryRepository.createProjectGallery(
      projectGallery,
      abortSignal,
      authenticate,
    );
  }
}
