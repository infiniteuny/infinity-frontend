import type { PersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Persona,
  PersonaFilterOptions,
  PersonaSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetPersonasParams = [
  filterOptions?: PersonaFilterOptions,
  sortOptions?: PersonaSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetPersonas implements UseCase<
  Promise<Either<[Persona[], PaginationOptions], Error>>,
  GetPersonasParams
> {
  private readonly personaRepository: PersonaRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.PersonaRepository)
    personaRepository: PersonaRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.personaRepository = personaRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: PersonaFilterOptions,
    sortOptions?: PersonaSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Persona[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.personaRepository.getPersonas(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
