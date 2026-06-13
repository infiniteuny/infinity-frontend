import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Persona,
  PersonaFilterOptions,
  PersonaSortOptions,
} from '@app/domain/entities';
import { PersonaMapper } from '@app/infrastructure/dtos';
import { PersonaRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class PersonaRepositoryImpl implements PersonaRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getPersonas(
    filterOptions?: PersonaFilterOptions,
    sortOptions?: PersonaSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Persona[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/personas', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[priority]': filterOptions?.priority,
          'filters[description]': filterOptions?.description,
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

      const personasResponse = response.data.data.personas.map(PersonaMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([personasResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const personaResponse = PersonaMapper.fromDtoToDomain(response.data.data.persona);

      return right(personaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createPersona(
    persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>> {
    try {
      const personaDto = PersonaMapper.fromDomainToDto(persona);
      const response = await this.infinityApiDataSource.postForm(
        '/personas',
        {
          ...personaDto,
          logo: personaDto.logo instanceof File ? personaDto.logo : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const personaResponse = PersonaMapper.fromDtoToDomain(response.data.data.persona);

      return right(personaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updatePersona(
    id: string,
    persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>> {
    try {
      const personaDto = PersonaMapper.fromDomainToDto(persona);
      const response = await this.infinityApiDataSource.putForm(
        `/personas/${id}`,
        {
          ...personaDto,
          logo: personaDto.logo instanceof File ? personaDto.logo : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const personaResponse = PersonaMapper.fromDtoToDomain(response.data.data.persona);

      return right(personaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deletePersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const personaResponse = PersonaMapper.fromDtoToDomain(response.data.data.persona);

      return right(personaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
