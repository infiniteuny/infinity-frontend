import { injectable } from 'inversify';

export interface LocalStorageDataSource {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class LocalStorageDataSourceImpl implements LocalStorageDataSource {
  public get<T>(key: string): T {
    return JSON.parse(window.localStorage.getItem(key) || '{}');
  }

  public set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    window.localStorage.removeItem(key);
  }
}
