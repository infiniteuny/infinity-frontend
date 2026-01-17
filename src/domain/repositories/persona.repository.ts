import { Either } from 'effect/Either';
import { PaginationOptions, Persona, PersonaFilterOptions } from '@app/domain/entities';

export interface PersonaRepository {
  getPersonas(
    filterOptions?: PersonaFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Persona[], PaginationOptions], Error>>;

  getPersona(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Persona, Error>>;

  createPersona(
    persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Persona, Error>>;

  updatePersona(
    id: string,
    persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Persona, Error>>;

  deletePersona(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Persona, Error>>;
}
