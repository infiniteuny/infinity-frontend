import type { GroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Group } from '@app/domain/entities';

export type GetGroupParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class GetGroup implements UseCase<Promise<Either<Group, Error>>, GetGroupParams> {
  private readonly groupRepository: GroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.GroupRepository)
    groupRepository: GroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.groupRepository = groupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.groupRepository.getGroup(id, abortSignal, accessToken);
  }
}
