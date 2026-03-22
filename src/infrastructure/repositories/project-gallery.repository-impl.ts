import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
} from '@app/domain/entities';
import { ProjectGalleryMapper } from '@app/infrastructure/dtos';
import { ProjectGalleryRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

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
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
              : undefined,
        },
      });

      const projectGalleriesResponse = response.data.data.project_galleries.map(
        ProjectGalleryMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([projectGalleriesResponse, paginationOptionsResponse]);
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

      const projectGalleryResponse = ProjectGalleryMapper.fromDtoToDomain(
        response.data.data.project_gallery,
      );

      return right(projectGalleryResponse);
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
      const response = await this.infinityApiDataSource.postForm(
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

      const projectGalleryResponse = ProjectGalleryMapper.fromDtoToDomain(
        response.data.data.project_gallery,
      );

      return right(projectGalleryResponse);
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
      const projectGalleryDto = ProjectGalleryMapper.fromDomaintoDto(projectGallery);

      const response = await this.infinityApiDataSource.putForm(
        `/project-galleries/${id}`,
        {
          ...projectGalleryDto,
          image: projectGalleryDto.image ?? undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const projectGalleryResponse = ProjectGalleryMapper.fromDtoToDomain(
        response.data.data.project_gallery,
      );

      return right(projectGalleryResponse);
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

      const projectGalleryResponse = ProjectGalleryMapper.fromDtoToDomain(
        response.data.data.project_gallery,
      );

      return right(projectGalleryResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
