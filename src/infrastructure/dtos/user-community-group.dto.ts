import { DateTime } from 'luxon';
import { UserCommunityGroup } from '@app/domain/entities';
import { CommunityGroupDto, CommunityGroupMapper } from './community-group.dto';

interface UserCommunityGroupMembershipDto {
  id: string;
  user_id: string;
  community_group_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserCommunityGroupDto extends CommunityGroupDto {
  membership: UserCommunityGroupMembershipDto;
}

export class UserCommunityGroupMapper {
  public static fromDomainToDto(
    userCommunityGroup: Partial<UserCommunityGroup>,
  ): Partial<UserCommunityGroupDto> {
    return {
      ...CommunityGroupMapper.fromDomainToDto(userCommunityGroup),
      membership: userCommunityGroup.membership
        ? {
            id: userCommunityGroup.membership.id,
            user_id: userCommunityGroup.membership.userId,
            community_group_id: userCommunityGroup.membership.communityGroupId,
            created_at: userCommunityGroup.membership.createdAt.toISOString(),
            updated_at: userCommunityGroup.membership.updatedAt.toISOString(),
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: UserCommunityGroupDto): UserCommunityGroup {
    return new UserCommunityGroup(
      dto.id,
      dto.name,
      dto.description,
      dto.priority,
      dto.logo,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.membership.id,
        userId: dto.membership.user_id,
        communityGroupId: dto.membership.community_group_id,
        createdAt: DateTime.fromISO(dto.membership.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.membership.updated_at).toJSDate(),
      },
    );
  }
}
