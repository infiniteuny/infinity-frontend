import { inject, injectable } from 'inversify';
import { InternalRepository } from '@app/domain/repositories';
import { SessionStorageDataSource } from '@app/infrastructure/datasources';
import { SYMBOLS } from '@config';

@injectable()
export class InternalRepositoryImpl implements InternalRepository {
  private readonly sessionStorageDataSource: SessionStorageDataSource;

  public constructor(
    @inject(SYMBOLS.SessionStorageDataSource)
    sessionStorageDataSource: SessionStorageDataSource,
  ) {
    this.sessionStorageDataSource = sessionStorageDataSource;
  }

  public getSidebarExtendedState(): boolean {
    return this.sessionStorageDataSource.get<boolean>('sidebar-extended');
  }

  public setSidebarExtendedState(state: boolean): void {
    this.sessionStorageDataSource.set<boolean>('sidebar-extended', state);
  }
}
