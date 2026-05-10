import type { PersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Persona } from '@app/domain/entities';

export type DeletePersonaParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeletePersona implements UseCase<
  Promise<Either<Persona, Error>>,
  DeletePersonaParams
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

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<Persona, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.personaRepository.deletePersona(id, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
