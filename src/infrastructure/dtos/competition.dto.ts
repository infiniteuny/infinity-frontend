import { DateTime } from 'luxon';
import { Competition } from '@app/domain/entities';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from './competition-organizer-type.dto';

export interface CompetitionDto {
  id: string;
  name: string;
  description: string;
  url: string | null;
  organizer: string;
  organizer_type_id: string;
  logo: string;
  created_at: string;
  updated_at: string;
  organizer_type?: CompetitionOrganizerTypeDto;
}

export class CompetitionMapper {
  public static fromDomaintoDto(competition: Partial<Competition>): Partial<CompetitionDto> {
    return {
      id: competition.id,
      name: competition.name,
      description: competition.description,
      url: competition.url,
      organizer: competition.organizer,
      organizer_type_id: competition.organizerTypeId,
      logo: competition.logo,
      created_at: competition.createdAt?.toISOString(),
      updated_at: competition.updatedAt?.toISOString(),
      organizer_type: competition.organizerType
        ? (CompetitionOrganizerTypeMapper.fromDomaintoDto(
            competition.organizerType,
          ) as CompetitionOrganizerTypeDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: CompetitionDto): Competition {
    return new Competition(
      dto.id,
      dto.name,
      dto.description,
      dto.url,
      dto.organizer,
      dto.organizer_type_id,
      dto.logo,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.organizer_type
        ? CompetitionOrganizerTypeMapper.fromDtoToDomain(dto.organizer_type)
        : undefined,
    );
  }
}
