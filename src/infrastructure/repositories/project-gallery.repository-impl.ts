import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  ProjectGallery,
  ProjectGalleryFilterOptions,
  ProjectGallerySortOptions,
} from '@app/domain/entities';
import { ProjectGalleryMapper } from '@app/infrastructure/dtos';
import { ProjectGalleryRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class ProjectGalleryRepositoryImpl implements ProjectGalleryRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getProjectGalleries(
    filterOptions?: ProjectGalleryFilterOptions,
    sortOptions?: ProjectGallerySortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[ProjectGallery[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/project-galleries', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
          sorts: sortOptions
            ? Object.entries(sortOptions)
                .map((sortOption) => {
                  const prefix = sortOption[1] === 'DESC' ? '-' : '';
                  const field = sortOption[0]
                    .split(/(?=[A-Z])/)
                    .join('_')
                    .toLowerCase();
                  return prefix + field;
                })
                .join(',')
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
    token?: string,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/project-galleries/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const projectGalleryDto = ProjectGalleryMapper.fromDomainToDto(projectGallery);

      const response = await this.infinityApiDataSource.postForm(
        '/project-galleries',
        {
          ...projectGalleryDto,
          image:
            projectGalleryDto.image instanceof File ? (projectGalleryDto.image as File) : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const projectGalleryDto = ProjectGalleryMapper.fromDomainToDto(projectGallery);

      const response = await this.infinityApiDataSource.putForm(
        `/project-galleries/${id}`,
        {
          ...projectGalleryDto,
          image:
            projectGalleryDto.image instanceof File ? (projectGalleryDto.image as File) : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<ProjectGallery, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/project-galleries/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
