import {PermissionsBase} from './permissions-base';

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
export class UnknownPermissions extends PermissionsBase {
  constructor() {
    super();
    this.permissions = [];
  }
}
