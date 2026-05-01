import { DateTime } from 'luxon';
import { UserPersona } from '@app/domain/entities';
import { PersonaDto, PersonaMapper } from './persona.dto';

interface UserPersonaEntitlementDto {
  id: string;
  user_id: string;
  persona_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserPersonaDto extends PersonaDto {
  entitlement: UserPersonaEntitlementDto;
}

export class UserPersonaMapper {
  public static fromDomainToDto(userPersona: Partial<UserPersona>): Partial<UserPersonaDto> {
    return {
      ...PersonaMapper.fromDomainToDto(userPersona),
      entitlement: userPersona.entitlement
        ? {
            id: userPersona.entitlement.id,
            user_id: userPersona.entitlement.userId,
            persona_id: userPersona.entitlement.personaId,
            created_at: userPersona.entitlement.createdAt.toISOString(),
            updated_at: userPersona.entitlement.updatedAt.toISOString(),
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: UserPersonaDto): UserPersona {
    return new UserPersona(
      dto.id,
      dto.name,
      dto.priority,
      dto.description,
      dto.logo,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      {
        id: dto.entitlement.id,
        userId: dto.entitlement.user_id,
        personaId: dto.entitlement.persona_id,
        createdAt: DateTime.fromISO(dto.entitlement.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.entitlement.updated_at).toJSDate(),
      },
    );
  }
}
