import { DateTime } from 'luxon';
import { UserGroup } from '@app/domain/entities';
import { GroupDto, GroupMapper } from './group.dto';

interface UserGroupEntitlementDto {
  id: string;
  user_id: string;
  group_id: string;
}

export interface UserGroupDto extends GroupDto {
  entitlement: UserGroupEntitlementDto;
}

export class UserGroupMapper {
  public static fromDomainToDto(userGroup: Partial<UserGroup>): Partial<UserGroupDto> {
    return {
      ...GroupMapper.fromDomainToDto(userGroup),
      entitlement: userGroup.entitlement
        ? {
            id: userGroup.entitlement.id,
            user_id: userGroup.entitlement.userId,
            group_id: userGroup.entitlement.groupId,
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: UserGroupDto): UserGroup {
    return new UserGroup(
      dto.id,
      dto.name,
      dto.guard_name,
      dto.is_managed,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.entitlement.id,
        userId: dto.entitlement.user_id,
        groupId: dto.entitlement.group_id,
      },
    );
  }
}
