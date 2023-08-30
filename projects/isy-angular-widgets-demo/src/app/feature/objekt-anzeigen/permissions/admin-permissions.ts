import {PermissionsBase} from './permissions-base';
import {ADMIN_PERMISSIONS} from '../data/permissions-data';

export class AdminPermissions extends PermissionsBase {
  constructor() {
    super();
    this.permissions = ADMIN_PERMISSIONS;
  }
}
