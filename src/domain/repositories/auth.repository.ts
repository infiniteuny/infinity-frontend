import { Session } from '@app/domain/entities';

export interface AuthRepository {
  signIn(callbacksUrl?: string): Promise<void>;
  getSession(): Promise<Session | null>;
}
