import { Permission, PermissionFilterOptions, PermissionSortOptions } from './permission';

export type GroupPermissionFilterOptions = PermissionFilterOptions;

export type GroupPermissionSortOptions = PermissionSortOptions;

export class GroupPermission extends Permission {
  public entitlement: {
    id: string;
    groupId: string;
    permissionId: string;
  };

  public constructor(
    id: string,
    name: string,
    guardName: 'api',
    createdAt: Date,
    updatedAt: Date,
    entitlement: {
      id: string;
      groupId: string;
      permissionId: string;
    },
  ) {
    super(id, name, guardName, createdAt, updatedAt);
    this.entitlement = entitlement;
  }
}
