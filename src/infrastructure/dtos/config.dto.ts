import { DateTime } from 'luxon';
import { Config } from '@app/domain/entities';

export interface ConfigDto {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'INTEGER' | 'BOOLEAN';
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export class ConfigMapper {
  public static fromDomainToDto(config: Partial<Config>): Partial<ConfigDto> {
    return {
      id: config.id,
      key: config.key,
      value: config.value,
      type: config.type,
      is_private: config.isPrivate,
      created_at: config.createdAt?.toISOString(),
      updated_at: config.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: ConfigDto): Config {
    return new Config(
      dto.id,
      dto.key,
      dto.value,
      dto.type,
      dto.is_private,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
