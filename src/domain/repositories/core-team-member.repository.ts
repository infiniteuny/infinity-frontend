import { CoreTeamMember } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CoreTeamMemberRepository {
  getCoreTeamMembers(
    coreTeamId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember[], Error>>;

  getCoreTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  createCoreTeamMember(
    coreTeamId: string,
    coreTeamMember: { userId: string; coreTeamDivisionId: string; position: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  updateCoreTeamMember(
    id: string,
    coreTeamMember: { coreTeamDivisionId?: string; position?: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;

  deleteCoreTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamMember, Error>>;
}
