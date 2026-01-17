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
  public static fromDomaintoDto(persona: Partial<Persona>): Partial<PersonaDto> {
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

  public static fromDtoToDomain(personaDto: PersonaDto): Persona {
    return new Persona(
      personaDto.id,
      personaDto.name,
      personaDto.priority,
      personaDto.description,
      personaDto.logo,
      DateTime.fromISO(personaDto.created_at).toJSDate(),
      DateTime.fromISO(personaDto.updated_at).toJSDate(),
    );
  }
}
