import { Either } from 'effect/Either';
import { Session } from '@app/domain/entities';

export interface AuthRepository {
  signIn(callbackUrl?: string): Promise<Either<void, Error>>;
  signOut(): Promise<Either<void, Error>>;
  getSession(request?: Request): Promise<Either<Session, Error>>;
  getAccessToken(request?: Request): Promise<Either<string, Error>>;
}
