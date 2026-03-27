import type { ProjectGalleryRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { ProjectGallery } from '@app/domain/entities';

export type UpdateProjectGalleryParams = [
  id: string,
  projectGallery: Partial<Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateProjectGallery implements UseCase<
  Promise<Either<ProjectGallery, Error>>,
  UpdateProjectGalleryParams
> {
  private readonly projectGalleryRepository: ProjectGalleryRepository;

  public constructor(
    @inject(SYMBOLS.ProjectGalleryRepository)
    projectGalleryRepository: ProjectGalleryRepository,
  ) {
    this.projectGalleryRepository = projectGalleryRepository;
  }

  public async execute(
    id: string,
    projectGallery: Partial<Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<ProjectGallery, Error>> {
    return await this.projectGalleryRepository.updateProjectGallery(
      id,
      projectGallery,
      abortSignal,
      authenticate,
    );
  }
}
