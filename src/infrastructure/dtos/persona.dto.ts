import { Persona } from '@app/domain/entities';
import { DateTime } from 'luxon';

export interface PersonaDto {
  id: string;
  name: string;
  priority: number;
  description: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

export class PersonaMapper {
  public static fromDomainToDto(persona: Partial<Persona>): Partial<PersonaDto> {
    return {
      id: persona.id,
      name: persona.name,
      priority: persona.priority,
      description: persona.description,
      logo: persona.logo,
      created_at: persona.createdAt?.toISOString(),
      updated_at: persona.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: PersonaDto): Persona {
    return new Persona(
      dto.id,
      dto.name,
      dto.priority,
      dto.description,
      dto.logo,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
