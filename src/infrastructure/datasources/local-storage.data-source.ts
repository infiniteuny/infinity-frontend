import { injectable } from 'inversify';

export abstract class LocalStorageDataSource {
  public abstract get<T>(key: string): T;
  public abstract set<T>(key: string, value: T): void;
  public abstract remove(key: string): void;
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
