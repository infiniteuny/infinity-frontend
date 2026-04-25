import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { CommunityGroupAdminMember } from '@app/domain/entities';
import { CommunityGroupAdminMemberMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class CommunityGroupAdminMemberRepositoryImpl implements CommunityGroupAdminMemberRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCommunityGroupAdminMembers(
    communityGroupAdminId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-group-admins/${communityGroupAdminId}/members`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMembersResponse =
        response.data.data.community_group_admin_members.map(
          CommunityGroupAdminMemberMapper.fromDtoToDomain,
        );

      return right(communityGroupAdminMembersResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(
        `/community-group-admin-members/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupAdminMember(
    communityGroupAdminId: string,
    communityGroupAdminMember: { userId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/community-group-admins/${communityGroupAdminId}/members`,
        {
          user_id: communityGroupAdminMember.userId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroupAdminMember(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(
        `/community-group-admin-members/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const communityGroupAdminMemberResponse = CommunityGroupAdminMemberMapper.fromDtoToDomain(
        response.data.data.community_group_admin_member,
      );

      return right(communityGroupAdminMemberResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
