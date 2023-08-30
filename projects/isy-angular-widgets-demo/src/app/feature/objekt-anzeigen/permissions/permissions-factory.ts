import {PermissionsBase} from './permissions-base';
import {Role} from '../model/auth';
import {AdminPermissions} from './admin-permissions';
import {UserPermissions} from './user-permissions';
import {UnknownPermissions} from './unknown-permissions';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export class PermissionsFactory {
  private static instance: PermissionsBase;

  private constructor() {
    // private and unused constructor because singleton pattern
  }

  static getInstance(): PermissionsBase {
    const role = localStorage.getItem('role');
    if (role) {
      switch (role) {
        case Role.ADMIN:
          this.instance = new AdminPermissions();
          break;
        case Role.USER:
          this.instance = new UserPermissions();
          break;
        default:
          this.instance = new UnknownPermissions();
          break;
      }
    }
    return this.instance;
  }
}
