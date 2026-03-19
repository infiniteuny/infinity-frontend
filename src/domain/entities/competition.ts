import { FilterOperator } from '.';
import { CompetitionOrganizerType } from './competition-organizer-type';

export type CompetitionIncludeOptions = 'organizer_type'[];

export interface CompetitionFilterOptions {
  name?: string;
  description?: string;
  url?: string;
  organizer?: string;
  organizerTypeId?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CompetitionSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  organizer?: 'ASC' | 'DESC';
  organizerTypeId?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Competition {
  public id: string;
  public name: string;
  public description: string;
  public url: string | null;
  public organizer: string;
  public organizerTypeId: string;
  public logo: string;
  public createdAt: Date;
  public updatedAt: Date;
  public organizerType?: CompetitionOrganizerType;

  public constructor(
    id: string,
    name: string,
    description: string,
    url: string | null,
    organizer: string,
    organizerTypeId: string,
    logo: string,
    createdAt: Date,
    updatedAt: Date,
    organizerType?: CompetitionOrganizerType,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
    this.organizer = organizer;
    this.organizerTypeId = organizerTypeId;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.organizerType = organizerType;
  }
}
