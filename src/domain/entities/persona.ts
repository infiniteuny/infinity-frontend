import { FilterOperator } from '.';

export interface PersonaFilterOptions {
  name?: string;
  priority?: number;
  description?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface PersonaSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  priority?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Persona {
  public id: string;
  public name: string;
  public priority: number;
  public description: string;
  public logo: string | File;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    priority: number,
    description: string,
    logo: string | File,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.description = description;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
