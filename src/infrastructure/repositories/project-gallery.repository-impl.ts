import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { ProjectGalleryRepository } from '@app/domain/repositories';
import { ProjectGalleryMapper } from '@app/infrastructure/dtos';

export class ProjectGalleryRepositoryImpl implements ProjectGalleryRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getProjectGalleries(
    filterOptions?: ProjectGalleryFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/project-galleries', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[title]': filterOptions?.title,
          'filters[description]': filterOptions?.description,
          'filters[url]': filterOptions?.url,
        },
      });

      return right([
        response.data.data.map(ProjectGalleryMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/project-galleries/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(ProjectGalleryMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createProjectGallery(
    projectGallery: Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/project-galleries',
        ProjectGalleryMapper.fromDomaintoDto(projectGallery),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(ProjectGalleryMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateProjectGallery(
    id: string,
    projectGallery: Partial<Omit<ProjectGallery, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/project-galleries/${id}`,
        ProjectGalleryMapper.fromDomaintoDto(projectGallery),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(ProjectGalleryMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteProjectGallery(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/project-galleries/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(ProjectGalleryMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
