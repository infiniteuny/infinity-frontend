import { DateTime } from 'luxon';
import { Group } from '@app/domain/entities';

export interface GroupDto {
  id: string;
  name: string;
  guard_name: 'api';
  created_at: string;
  updated_at: string;
}

export class GroupMapper {
  public static fromDomaintoDto(group: Partial<Group>): Partial<GroupDto> {
    return {
      id: group.id,
      name: group.name,
      guard_name: group.guardName,
      created_at: group.createdAt?.toISOString(),
      updated_at: group.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: GroupDto): Group {
    return new Group(
      dto.id,
      dto.name,
      dto.guard_name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
