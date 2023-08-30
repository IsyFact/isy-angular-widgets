import {PermissionsBase} from './permissions-base';
import {PermissionType} from '../model/auth';

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
export class AdminPermissions extends PermissionsBase {
  constructor() {
    super();
    this.permissions = [
      PermissionType.CREATE,
      PermissionType.DELETE,
      PermissionType.READ,
      PermissionType.UPDATE,
      PermissionType.EDIT
    ];
  }
}
