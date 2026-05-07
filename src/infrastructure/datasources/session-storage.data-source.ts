import { injectable } from 'inversify';

export interface SessionStorageDataSource {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class SessionStorageDataSourceImpl implements SessionStorageDataSource {
  public get<T>(key: string): T {
    const result = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null;

    return JSON.parse(result || '{}');
  }

  public set<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  public remove(key: string): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key);
    }
  }
}
