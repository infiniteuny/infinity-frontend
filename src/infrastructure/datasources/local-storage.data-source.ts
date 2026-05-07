import { injectable } from 'inversify';

export interface LocalStorageDataSource {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class LocalStorageDataSourceImpl implements LocalStorageDataSource {
  public get<T>(key: string): T {
    const result = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;

    return JSON.parse(result || '{}');
  }

  public set<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public remove(key: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
}
