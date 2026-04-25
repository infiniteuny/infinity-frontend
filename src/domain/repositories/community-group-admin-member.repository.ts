import { CommunityGroupAdminMember } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface CommunityGroupAdminMemberRepository {
  getCommunityGroupAdminMembers(
    communityGroupAdminId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember[], Error>>;

  getCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;

  createCommunityGroupAdminMember(
    communityGroupAdminId: string,
    communityGroupAdminMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;

  deleteCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>>;
}
