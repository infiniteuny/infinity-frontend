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
  url?: string;
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

  public static fromDtoToDomain(competitionDto: CompetitionDto): Competition {
    return new Competition(
      competitionDto.id,
      competitionDto.name,
      competitionDto.description,
      competitionDto.url,
      competitionDto.organizer,
      competitionDto.organizer_type_id,
      competitionDto.logo,
      DateTime.fromISO(competitionDto.created_at).toJSDate(),
      DateTime.fromISO(competitionDto.updated_at).toJSDate(),
      competitionDto.organizer_type
        ? CompetitionOrganizerTypeMapper.fromDtoToDomain(competitionDto.organizer_type)
        : undefined,
    );
  }
}
