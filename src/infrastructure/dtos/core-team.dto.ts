import { DateTime } from 'luxon';
import { CoreTeam } from '@app/domain/entities';
import { GroupDto, GroupMapper } from './group.dto';

export interface CoreTeamDto {
  id: string;
  year: number;
  group_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  group?: GroupDto;
}

export class CoreTeamMapper {
  public static fromDomaintoDto(coreTeam: Partial<CoreTeam>): Partial<CoreTeamDto> {
    return {
      id: coreTeam.id,
      year: coreTeam.year,
      group_id: coreTeam.groupId,
      is_active: coreTeam.isActive,
      created_at: coreTeam.createdAt?.toISOString(),
      updated_at: coreTeam.updatedAt?.toISOString(),
      group: coreTeam.group ? (GroupMapper.fromDomaintoDto(coreTeam.group) as GroupDto) : undefined,
    };
  }

  public static fromDtoToDomain(dto: CoreTeamDto): CoreTeam {
    return new CoreTeam(
      dto.id,
      dto.year,
      dto.group_id,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.group ? GroupMapper.fromDtoToDomain(dto.group) : undefined,
    );
  }
}
