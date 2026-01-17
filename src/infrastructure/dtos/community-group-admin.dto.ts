import { DateTime } from 'luxon';
import { CommunityGroupAdmin } from '@app/domain/entities';
import { GroupDto, GroupMapper } from './group.dto';

export interface CommunityGroupAdminDto {
  id: string;
  year: number;
  group_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  group?: GroupDto;
}

export class CommunityGroupAdminMapper {
  public static fromDomaintoDto(
    communityGroupAdmin: Partial<CommunityGroupAdmin>,
  ): Partial<CommunityGroupAdminDto> {
    return {
      id: communityGroupAdmin.id,
      year: communityGroupAdmin.year,
      group_id: communityGroupAdmin.groupId,
      is_active: communityGroupAdmin.isActive,
      created_at: communityGroupAdmin.createdAt?.toISOString(),
      updated_at: communityGroupAdmin.updatedAt?.toISOString(),
      group: communityGroupAdmin.group
        ? (GroupMapper.fromDomaintoDto(communityGroupAdmin.group) as GroupDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: CommunityGroupAdminDto): CommunityGroupAdmin {
    return new CommunityGroupAdmin(
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
