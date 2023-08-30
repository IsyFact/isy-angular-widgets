import {PermissionsBase} from './permissions-base';
import {UNKNOWN_PERMISSIONS} from '../data/permissions-data';

export class UnknownPermissions extends PermissionsBase {
  constructor() {
    super();
    this.permissions = UNKNOWN_PERMISSIONS;
  }
}
