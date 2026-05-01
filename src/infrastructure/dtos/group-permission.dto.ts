import { DateTime } from 'luxon';
import { GroupPermission } from '@app/domain/entities';
import { PermissionDto } from './permission.dto';

interface GroupPermissionEntitlementDto {
  id: string;
  group_id: string;
  permission_id: string;
}

export interface GroupPermissionDto extends PermissionDto {
  entitlement: GroupPermissionEntitlementDto;
}

export class GroupPermissionMapper {
  public static fromDomainToDto(
    groupPermission: Partial<GroupPermission>,
  ): Partial<GroupPermissionDto> {
    return {
      id: groupPermission.id,
      name: groupPermission.name,
      guard_name: groupPermission.guardName,
      created_at: groupPermission.createdAt?.toISOString(),
      updated_at: groupPermission.updatedAt?.toISOString(),
      entitlement: groupPermission.entitlement
        ? {
            id: groupPermission.entitlement.id,
            group_id: groupPermission.entitlement.groupId,
            permission_id: groupPermission.entitlement.permissionId,
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: GroupPermissionDto): GroupPermission {
    return new GroupPermission(
      dto.id,
      dto.name,
      dto.guard_name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.entitlement.id,
        groupId: dto.entitlement.group_id,
        permissionId: dto.entitlement.permission_id,
      },
    );
  }
}
