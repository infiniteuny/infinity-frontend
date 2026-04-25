import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { UserPersona } from '@app/domain/entities';
import { UserPersonaMapper } from '@app/infrastructure/dtos';
import { UserPersonaRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class UserPersonaRepositoryImpl implements UserPersonaRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserPersonas(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/personas`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPersonasResponse = response.data.data.user_personas.map(
        UserPersonaMapper.fromDtoToDomain,
      );

      return right(userPersonasResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/user-personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUserPersona(
    userId: string,
    userPersona: { personaId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/users/${userId}/personas`,
        {
          persona_id: userPersona.personaId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/user-personas/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPersonaResponse = UserPersonaMapper.fromDtoToDomain(
        response.data.data.user_persona,
      );

      return right(userPersonaResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
