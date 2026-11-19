import { DateTime } from 'luxon';
import { CommunityGroupAdmin } from '@infiniteuny/infinity-domain';

export interface CommunityGroupAdminDto {
  id: string;
  group_id: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CommunityGroupAdminMapper {
  public static fromDomainToDto(
    communityGroupAdmin: Partial<CommunityGroupAdmin>,
  ): Partial<CommunityGroupAdminDto> {
    return {
      id: communityGroupAdmin.id,
      group_id: communityGroupAdmin.groupId,
      year: communityGroupAdmin.year,
      is_active: communityGroupAdmin.isActive,
      created_at: communityGroupAdmin.createdAt?.toISOString(),
      updated_at: communityGroupAdmin.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CommunityGroupAdminDto): CommunityGroupAdmin {
    return new CommunityGroupAdmin(
      dto.id,
      dto.group_id,
      dto.year,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
