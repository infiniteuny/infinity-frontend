import { DateTime } from 'luxon';
import { Team } from '@app/domain/entities';
import { UserDto, UserMapper } from './user.dto';

export interface TeamDto {
  id: string;
  leader_id: string;
  name: string;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  leader: UserDto;
}

export class TeamMapper {
  public static fromDomaintoDto(team: Partial<Team>): Partial<TeamDto> {
    return {
      id: team.id,
      leader_id: team.leaderId,
      name: team.name,
      is_personal: team.isPersonal,
      created_at: team.createdAt?.toISOString(),
      updated_at: team.updatedAt?.toISOString(),
      leader: team.leader ? (UserMapper.fromDomaintoDto(team.leader) as UserDto) : undefined,
    };
  }

  public static fromDtoToDomain(teamDto: TeamDto): Team {
    return new Team(
      teamDto.id,
      teamDto.leader_id,
      teamDto.name,
      teamDto.is_personal,
      DateTime.fromISO(teamDto.created_at).toJSDate(),
      DateTime.fromISO(teamDto.updated_at).toJSDate(),
      UserMapper.fromDtoToDomain(teamDto.leader),
    );
  }
}
