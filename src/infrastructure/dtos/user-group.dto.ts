import { DateTime } from 'luxon';
import { UserGroup } from '@app/domain/entities';
import { GroupDto, GroupMapper } from './group.dto';

interface UserGroupMembershipDto {
  id: string;
  user_id: string;
  group_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserGroupDto extends GroupDto {
  membership: UserGroupMembershipDto;
}

export class UserGroupMapper {
  public static fromDomaintoDto(userGroup: Partial<UserGroup>): Partial<UserGroupDto> {
    return {
      ...GroupMapper.fromDomaintoDto(userGroup),
      membership: userGroup.membership
        ? {
            id: userGroup.membership.id,
            user_id: userGroup.membership.userId,
            group_id: userGroup.membership.groupId,
            created_at: userGroup.membership.createdAt.toISOString(),
            updated_at: userGroup.membership.updatedAt.toISOString(),
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: UserGroupDto): UserGroup {
    return new UserGroup(
      dto.id,
      dto.name,
      dto.guard_name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.membership.id,
        userId: dto.membership.user_id,
        groupId: dto.membership.group_id,
        createdAt: DateTime.fromISO(dto.membership.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.membership.updated_at).toJSDate(),
      },
    );
  }
}
