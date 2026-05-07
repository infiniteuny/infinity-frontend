import { FilterOperator } from '.';
import { Major } from './major';

export type UserIncludeOptions = (
  | 'major'
  | 'major.degree'
  | 'major.faculty'
  | 'personas'
  | 'groups'
  | 'permissions'
)[];

export interface UserFilterOptions {
  ssoId?: string;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  studentId?: string;
  majorId?: string;
  startDateOperator?: FilterOperator;
  startDate?: Date;
  endDateOperator?: FilterOperator;
  endDate?: Date;
  isMember?: boolean;
  isExtraordinary?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface UserSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  emailAddress?: 'ASC' | 'DESC';
  phoneNumber?: 'ASC' | 'DESC';
  studentId?: 'ASC' | 'DESC';
  majorId?: 'ASC' | 'DESC';
  startDate?: 'ASC' | 'DESC';
  endDate?: 'ASC' | 'DESC';
  isMember?: 'ASC' | 'DESC';
  isExtraordinary?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class User {
  public id: string;
  public name: string;
  public username: string;
  public emailAddress: string;
  public phoneNumber: string;
  public studentId: string;
  public majorId: string;
  public links: Record<string, string | undefined>;
  public startDate: Date | null;
  public endDate: Date | null;
  public isMember: boolean;
  public isExtraordinary: boolean;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public major?: Major;

  public constructor(
    id: string,
    name: string,
    username: string,
    emailAddress: string,
    phoneNumber: string,
    studentId: string,
    majorId: string,
    links: Record<string, string | undefined>,
    startDate: Date | null,
    endDate: Date | null,
    isMember: boolean,
    isExtraordinary: boolean,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    major?: Major,
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.studentId = studentId;
    this.majorId = majorId;
    this.links = links;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isMember = isMember;
    this.isExtraordinary = isExtraordinary;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.major = major;
  }
}
