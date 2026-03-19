import { DateTime } from 'luxon';
import { Team } from '@app/domain/entities';
import { UserDto, UserMapper } from './user.dto';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from './competition-team-type.dto';

export interface TeamDto {
  id: string;
  leader_id: string;
  team_type_id: string;
  name: string;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  leader?: UserDto;
  team_type?: CompetitionTeamTypeDto;
}

export class TeamMapper {
  public static fromDomaintoDto(team: Partial<Team>): Partial<TeamDto> {
    return {
      id: team.id,
      leader_id: team.leaderId,
      team_type_id: team.teamTypeId,
      name: team.name,
      is_personal: team.isPersonal,
      created_at: team.createdAt?.toISOString(),
      updated_at: team.updatedAt?.toISOString(),
      leader: team.leader ? (UserMapper.fromDomaintoDto(team.leader) as UserDto) : undefined,
      team_type: team.teamType
        ? (CompetitionTeamTypeMapper.fromDomaintoDto(team.teamType) as CompetitionTeamTypeDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: TeamDto): Team {
    return new Team(
      dto.id,
      dto.leader_id,
      dto.team_type_id,
      dto.name,
      dto.is_personal,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.leader ? UserMapper.fromDtoToDomain(dto.leader) : undefined,
      dto.team_type ? CompetitionTeamTypeMapper.fromDtoToDomain(dto.team_type) : undefined,
    );
  }
}
