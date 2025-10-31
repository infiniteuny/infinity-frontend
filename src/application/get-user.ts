import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { User } from '@app/domain/entities';

export type GetUserParams = [
  id: string,
  includeOptions?: ('major' | 'personas' | 'groups' | 'permissions')[],
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetUser implements UseCase<Promise<Either<User, Error>>, GetUserParams> {
  private readonly userRepository: UserRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(
    id: string,
    includeOptions?: ('major' | 'personas' | 'groups' | 'permissions')[],
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>> {
    return await this.userRepository.getUser(id, includeOptions, abortSignal, authenticate);
  }
}
