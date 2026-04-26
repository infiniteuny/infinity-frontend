import { FilterOperator } from '.';
import { Competition } from './competition';
import { CompetitionOrganizerType } from './competition-organizer-type';

export type CompetitionInstanceIncludeOptions = ('competition' | 'organizer_type')[];

export interface CompetitionInstanceFilterOptions {
  competitionId?: string;
  name?: string;
  description?: string;
  url?: string;
  organizer?: string;
  organizerTypeId?: string;
  startDateOperator?: FilterOperator;
  startDate?: Date;
  endDateOperator?: FilterOperator;
  endDate?: Date;
  location?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CompetitionInstanceSortOptions {
  id?: 'ASC' | 'DESC';
  competitionId?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  organizer?: 'ASC' | 'DESC';
  organizerTypeId?: 'ASC' | 'DESC';
  startDate?: 'ASC' | 'DESC';
  endDate?: 'ASC' | 'DESC';
  location?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CompetitionInstance {
  public id: string;
  public competitionId: string;
  public name: string;
  public description: string;
  public url: string | null;
  public organizer: string;
  public organizerTypeId: string;
  public logo: string | File;
  public startDate: Date;
  public endDate: Date;
  public location: string;
  public createdAt: Date;
  public updatedAt: Date;
  public competition?: Competition;
  public organizerType?: CompetitionOrganizerType;

  public constructor(
    id: string,
    competitionId: string,
    name: string,
    description: string,
    url: string | null,
    organizer: string,
    organizerTypeId: string,
    logo: string | File,
    startDate: Date,
    endDate: Date,
    location: string,
    createdAt: Date,
    updatedAt: Date,
    competition?: Competition,
    organizerType?: CompetitionOrganizerType,
  ) {
    this.id = id;
    this.competitionId = competitionId;
    this.name = name;
    this.description = description;
    this.url = url;
    this.organizer = organizer;
    this.organizerTypeId = organizerTypeId;
    this.logo = logo;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.competition = competition;
    this.organizerType = organizerType;
  }
}
