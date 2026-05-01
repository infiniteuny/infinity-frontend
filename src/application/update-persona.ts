import type { PersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Persona } from '@app/domain/entities';

export type UpdatePersonaParams = [
  id: string,
  persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdatePersona implements UseCase<
  Promise<Either<Persona, Error>>,
  UpdatePersonaParams
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
    id: string,
    persona: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Persona, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.personaRepository.updatePersona(
        id,
        persona,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
