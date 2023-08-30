import {PermissionsBase} from './permissions-base';
import {USER_PERMISSIONS} from '../data/permissions-data';

export class UserPermissions extends PermissionsBase {
  constructor() {
    super();
    this.permissions = USER_PERMISSIONS;
  }
}
