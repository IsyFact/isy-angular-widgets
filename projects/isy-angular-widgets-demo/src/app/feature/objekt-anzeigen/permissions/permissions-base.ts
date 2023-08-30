import {PermissionType} from '../model/auth';

export abstract class PermissionsBase {
  permissions!: PermissionType[];

  protected constructor() {
  }
}
