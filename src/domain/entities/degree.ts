import { FilterOperator } from '.';

export interface DegreeFilterOptions {
  code?: string;
  name?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export class Degree {
  public id: string;
  public code: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(id: string, code: string, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
