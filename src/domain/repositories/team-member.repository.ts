import { TeamMember } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface TeamMemberRepository {
  getTeamMembers(
    teamId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember[], Error>>;

  getTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;

  createTeamMember(
    teamId: string,
    teamMember: { userId: string; role: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;

  updateTeamMember(
    id: string,
    teamMember: { role?: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;

  deleteTeamMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<TeamMember, Error>>;
}
