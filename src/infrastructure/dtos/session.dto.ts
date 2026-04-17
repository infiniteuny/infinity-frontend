import { DateTime } from 'luxon';
import { Session } from '@app/domain/entities';

export interface SessionDto {
  user: {
    id: string;
    name: string;
    username: string;
    email_address: string;
    picture?: string;
  };
  permissions: string[];
  expires_at: string;
}

export class SessionMapper {
  public static fromDomaintoDto(session: Partial<Session>): Partial<SessionDto> {
    return {
      user: session.user
        ? {
            id: session.user.id,
            name: session.user.name,
            username: session.user.username,
            email_address: session.user.emailAddress,
            picture: session.user.picture,
          }
        : undefined,
      permissions: session.permissions,
      expires_at: session.expiresAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: SessionDto): Session {
    return new Session(
      {
        id: dto.user.id,
        name: dto.user.name,
        username: dto.user.username,
        emailAddress: dto.user.email_address,
        picture: dto.user.picture,
      },
      dto.permissions,
      DateTime.fromISO(dto.expires_at).toJSDate(),
    );
  }
}
