import { DateTime } from 'luxon';
import { CommunityGroup } from '@app/domain/entities';

export interface CommunityGroupDto {
  id: string;
  name: string;
  priority: number;
  description: string;
  logo: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CommunityGroupMapper {
  public static fromDomaintoDto(
    communityGroup: Partial<CommunityGroup>,
  ): Partial<CommunityGroupDto> {
    return {
      id: communityGroup.id,
      name: communityGroup.name,
      priority: communityGroup.priority,
      description: communityGroup.description,
      logo: communityGroup.logo,
      is_active: communityGroup.isActive,
      created_at: communityGroup.createdAt?.toISOString(),
      updated_at: communityGroup.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CommunityGroupDto): CommunityGroup {
    return new CommunityGroup(
      dto.id,
      dto.name,
      dto.priority,
      dto.description,
      dto.logo,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
