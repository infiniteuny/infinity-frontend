import { injectable } from 'inversify';

export interface SessionStorageDataSource {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class SessionStorageDataSourceImpl implements SessionStorageDataSource {
  public get<T>(key: string): T {
    return JSON.parse(window.sessionStorage.getItem(key) || '{}');
  }

  public set<T>(key: string, value: T): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}
