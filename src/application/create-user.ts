import type { UserRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { User } from '@app/domain/entities';

export type CreateUserParams = [
  user: PartialBy<
    Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
    'startDate' | 'endDate'
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateUser implements UseCase<Promise<Either<User, Error>>, CreateUserParams> {
  private readonly userRepository: UserRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    user: PartialBy<
      Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
      'startDate' | 'endDate'
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<User, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userRepository.createUser(user, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
