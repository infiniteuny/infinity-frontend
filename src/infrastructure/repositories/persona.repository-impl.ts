import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Persona, PersonaFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { PersonaRepository } from '@app/domain/repositories';
import { PersonaMapper } from '@app/infrastructure/dtos';

export class PersonaRepositoryImpl implements PersonaRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getPersonas(
    filterOptions?: PersonaFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Persona[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/personas', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[priority]': filterOptions?.priority,
          'filters[description]': filterOptions?.description,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(PersonaMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getPersona(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(PersonaMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createPersona(
    persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/personas',
        PersonaMapper.fromDomaintoDto(persona),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(PersonaMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updatePersona(
    id: string,
    persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/personas/${id}`,
        PersonaMapper.fromDomaintoDto(persona),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(PersonaMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deletePersona(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Persona, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(PersonaMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
