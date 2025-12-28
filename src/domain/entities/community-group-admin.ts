import { Group } from './group';

export class CommunityGroupAdmin {
  public id: string;
  public year: number;
  public groupId: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public group?: Group;

  public constructor(
    id: string,
    year: number,
    groupId: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    group: Group | undefined,
  ) {
    this.id = id;
    this.year = year;
    this.groupId = groupId;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.group = group;
  }
}
