export interface AuthRepository {
  signIn(callbacksUrl?: string): Promise<void>;
}
