import type { CompetitionInstanceRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { CompetitionInstance, CompetitionInstanceIncludeOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionInstanceParams = [
  id: string,
  includeOptions?: CompetitionInstanceIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionInstance implements UseCase<
  Promise<Either<CompetitionInstance, Error>>,
  GetCompetitionInstanceParams
> {
  private readonly competitionInstanceRepository: CompetitionInstanceRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionInstanceRepository)
    competitionInstanceRepository: CompetitionInstanceRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionInstanceRepository = competitionInstanceRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    includeOptions?: CompetitionInstanceIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionInstance, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.competitionInstanceRepository.getCompetitionInstance(
      id,
      includeOptions,
      abortSignal,
      accessToken,
    );
  }
}
