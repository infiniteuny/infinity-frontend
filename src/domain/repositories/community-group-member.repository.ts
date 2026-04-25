import { CommunityGroupMember } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupMemberRepository {
  getCommunityGroupMembers(
    communityGroupId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember[], Error>>;

  getCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;

  createCommunityGroupMember(
    communityGroupId: string,
    communityGroupMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;

  deleteCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>>;
}
