import { DateTime } from 'luxon';
import { UserPersona } from '@app/domain/entities';
import { PersonaDto, PersonaMapper } from './persona.dto';

interface UserPersonaMembershipDto {
  id: string;
  user_id: string;
  persona_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserPersonaDto extends PersonaDto {
  membership: UserPersonaMembershipDto;
}

export class UserPersonaMapper {
  public static fromDomaintoDto(userPersona: Partial<UserPersona>): Partial<UserPersonaDto> {
    return {
      ...PersonaMapper.fromDomaintoDto(userPersona),
      membership: userPersona.membership
        ? {
            id: userPersona.membership.id,
            user_id: userPersona.membership.userId,
            persona_id: userPersona.membership.personaId,
            created_at: userPersona.membership.createdAt.toISOString(),
            updated_at: userPersona.membership.updatedAt.toISOString(),
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
        id: dto.membership.id,
        userId: dto.membership.user_id,
        personaId: dto.membership.persona_id,
        createdAt: DateTime.fromISO(dto.membership.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.membership.updated_at).toJSDate(),
      },
    );
  }
}
