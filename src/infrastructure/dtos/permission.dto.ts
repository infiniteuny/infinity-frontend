import { DateTime } from 'luxon';
import { Permission } from '@app/domain/entities';

export interface PermissionDto {
  id: string;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export class PermissionMapper {
  public static fromDomaintoDto(permission: Partial<Permission>): Partial<PermissionDto> {
    return {
      id: permission.id,
      name: permission.name,
      guard_name: permission.guardName,
      created_at: permission.createdAt?.toISOString(),
      updated_at: permission.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: PermissionDto): Permission {
    return new Permission(
      dto.id,
      dto.name,
      dto.guard_name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
