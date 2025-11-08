import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { User } from '@app/domain/entities';

export type DeleteUserParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class DeleteUser implements UseCase<Promise<Either<User, Error>>, DeleteUserParams> {
  private readonly userRepository: UserRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>> {
    return await this.userRepository.deleteUser(id, abortSignal, authenticate);
  }
}
