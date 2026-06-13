import { Either } from 'effect/Either';
import {
  PaginationOptions,
  Persona,
  PersonaFilterOptions,
  PersonaSortOptions,
} from '@app/domain/entities';

export interface PersonaRepository {
  getPersonas(
    filterOptions?: PersonaFilterOptions,
    sortOptions?: PersonaSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Persona[], PaginationOptions], Error>>;

  getPersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>>;

  createPersona(
    persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>>;

  updatePersona(
    id: string,
    persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>>;

  deletePersona(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Persona, Error>>;
}
