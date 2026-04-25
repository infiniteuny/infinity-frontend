import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { CommunityGroupMember } from '@app/domain/entities';
import { CommunityGroupMemberMapper } from '@app/infrastructure/dtos';
import { CommunityGroupMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class CommunityGroupMemberRepositoryImpl implements CommunityGroupMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCommunityGroupMembers(
    communityGroupId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-groups/${communityGroupId}/members`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupMembersResponse = response.data.data.community_group_members.map(
        CommunityGroupMemberMapper.fromDtoToDomain,
      );

      return right(communityGroupMembersResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/community-group-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupMember(
    communityGroupId: string,
    communityGroupMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/community-groups/${communityGroupId}/members`,
        {
          user_id: communityGroupMember.userId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroupMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/community-group-members/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const communityGroupMemberResponse = CommunityGroupMemberMapper.fromDtoToDomain(
        response.data.data.community_group_member,
      );

      return right(communityGroupMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
