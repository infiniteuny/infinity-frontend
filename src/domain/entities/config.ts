import { FilterOperator } from '.';

export interface ConfigFilterOptions {
  key?: string;
  type?: 'STRING' | 'INTEGER' | 'BOOLEAN';
  isPrivate?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface ConfigSortOptions {
  id?: 'ASC' | 'DESC';
  key?: 'ASC' | 'DESC';
  type?: 'ASC' | 'DESC';
  isPrivate?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Config {
  public id: string;
  public key: string;
  public value: string;
  public type: 'STRING' | 'INTEGER' | 'BOOLEAN';
  public isPrivate: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    key: string,
    value: string,
    type: 'STRING' | 'INTEGER' | 'BOOLEAN',
    isPrivate: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
    this.type = type;
    this.isPrivate = isPrivate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
