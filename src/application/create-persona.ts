import type { PersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Persona } from '@app/domain/entities';

export type CreatePersonaParams = [
  persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreatePersona implements UseCase<
  Promise<Either<Persona, Error>>,
  CreatePersonaParams
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
    persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Persona, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.personaRepository.createPersona(
        persona,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
