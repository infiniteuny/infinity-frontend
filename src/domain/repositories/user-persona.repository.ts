import { UserPersona } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserPersonaRepository {
  getUserPersonas(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona[], Error>>;

  getUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>>;

  createUserPersona(
    userId: string,
    userPersona: { personaId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>>;

  deleteUserPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPersona, Error>>;
}
