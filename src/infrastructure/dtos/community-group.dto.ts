import { DateTime } from 'luxon';
import { CommunityGroup } from '@app/domain/entities';

export interface CommunityGroupDto {
  id: string;
  name: string;
  description: string;
  priority: number;
  logo: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CommunityGroupMapper {
  public static fromDomainToDto(
    communityGroup: Partial<CommunityGroup>,
  ): Partial<CommunityGroupDto> {
    return {
      id: communityGroup.id,
      name: communityGroup.name,
      description: communityGroup.description,
      priority: communityGroup.priority,
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
      dto.description,
      dto.priority,
      dto.logo,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
