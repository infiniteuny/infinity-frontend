import { Permission } from './permission';

export class UserPermission extends Permission {
  public entitlement: {
    id: string;
    userId?: string;
    groupId?: string;
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
      userId?: string;
      groupId?: string;
      permissionId: string;
    },
  ) {
    super(id, name, guardName, createdAt, updatedAt);
    this.entitlement = entitlement;
  }
}
