import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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
  authenticate?: boolean,
];

@injectable()
export class CreateUser implements UseCase<Promise<Either<User, Error>>, CreateUserParams> {
  private readonly userRepository: UserRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(
    user: PartialBy<
      Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
      'startDate' | 'endDate'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>> {
    return await this.userRepository.createUser(user, abortSignal, authenticate);
  }
}
