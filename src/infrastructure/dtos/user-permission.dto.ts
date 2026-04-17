import { DateTime } from 'luxon';
import { UserPermission } from '@app/domain/entities';
import { PermissionDto } from './permission.dto';

interface UserPermissionEntitlementDto {
  id: string;
  user_id?: string;
  group_id?: string;
  permission_id: string;
}

export interface UserPermissionDto<T> extends PermissionDto {
  entitlement: T;
}

export class UserPermissionMapper {
  public static fromDomainToDto(
    userPermission: Partial<UserPermission>,
  ): Partial<UserPermissionDto<Partial<UserPermissionEntitlementDto>>> {
    return {
      id: userPermission.id,
      name: userPermission.name,
      guard_name: userPermission.guardName,
      created_at: userPermission.createdAt?.toISOString(),
      updated_at: userPermission.updatedAt?.toISOString(),
      entitlement: {
        id: userPermission.entitlement?.id,
        user_id: userPermission.entitlement?.userId,
        group_id: userPermission.entitlement?.groupId,
        permission_id: userPermission.entitlement?.permissionId,
      },
    };
  }

  public static fromDtoToDomain(
    dto: UserPermissionDto<UserPermissionEntitlementDto>,
  ): UserPermission {
    return new UserPermission(
      dto.id,
      dto.name,
      dto.guard_name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.entitlement.id,
        userId: dto.entitlement.user_id,
        groupId: dto.entitlement.group_id,
        permissionId: dto.entitlement.permission_id,
      },
    );
  }
}
