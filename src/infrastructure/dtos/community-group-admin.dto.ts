import { DateTime } from 'luxon';
import { CommunityGroupAdmin } from '@app/domain/entities';

export interface CommunityGroupAdminDto {
  id: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CommunityGroupAdminMapper {
  public static fromDomaintoDto(
    communityGroupAdmin: Partial<CommunityGroupAdmin>,
  ): Partial<CommunityGroupAdminDto> {
    return {
      id: communityGroupAdmin.id,
      year: communityGroupAdmin.year,
      is_active: communityGroupAdmin.isActive,
      created_at: communityGroupAdmin.createdAt?.toISOString(),
      updated_at: communityGroupAdmin.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CommunityGroupAdminDto): CommunityGroupAdmin {
    return new CommunityGroupAdmin(
      dto.id,
      dto.year,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
