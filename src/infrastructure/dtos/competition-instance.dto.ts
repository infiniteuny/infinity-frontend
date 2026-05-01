import { DateTime } from 'luxon';
import { CompetitionInstance } from '@app/domain/entities';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from './competition-organizer-type.dto';
import { CompetitionDto, CompetitionMapper } from './competition.dto';

export interface CompetitionInstanceDto {
  id: string;
  competition_id: string;
  name: string;
  description: string;
  url: string | null;
  organizer: string;
  organizer_type_id: string;
  logo: string | File;
  start_date: string;
  end_date: string;
  location: string;
  created_at: string;
  updated_at: string;
  competition?: CompetitionDto;
  organizer_type?: CompetitionOrganizerTypeDto;
}

export class CompetitionInstanceMapper {
  public static fromDomainToDto(
    competitionInstance: Partial<CompetitionInstance>,
  ): Partial<CompetitionInstanceDto> {
    return {
      id: competitionInstance.id,
      competition_id: competitionInstance.competitionId,
      name: competitionInstance.name,
      description: competitionInstance.description,
      url: competitionInstance.url,
      organizer: competitionInstance.organizer,
      organizer_type_id: competitionInstance.organizerTypeId,
      logo: competitionInstance.logo,
      start_date: competitionInstance.startDate?.toISOString(),
      end_date: competitionInstance.endDate?.toISOString(),
      location: competitionInstance.location,
      created_at: competitionInstance.createdAt?.toISOString(),
      updated_at: competitionInstance.updatedAt?.toISOString(),
      competition: competitionInstance.competition
        ? (CompetitionMapper.fromDomainToDto(competitionInstance.competition) as CompetitionDto)
        : undefined,
      organizer_type: competitionInstance.organizerType
        ? (CompetitionOrganizerTypeMapper.fromDomainToDto(
            competitionInstance.organizerType,
          ) as CompetitionOrganizerTypeDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: CompetitionInstanceDto): CompetitionInstance {
    return new CompetitionInstance(
      dto.id,
      dto.competition_id,
      dto.name,
      dto.description,
      dto.url,
      dto.organizer,
      dto.organizer_type_id,
      dto.logo,
      DateTime.fromISO(dto.start_date).toJSDate(),
      DateTime.fromISO(dto.end_date).toJSDate(),
      dto.location,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.competition ? CompetitionMapper.fromDtoToDomain(dto.competition) : undefined,
      dto.organizer_type
        ? CompetitionOrganizerTypeMapper.fromDtoToDomain(dto.organizer_type)
        : undefined,
    );
  }
}
