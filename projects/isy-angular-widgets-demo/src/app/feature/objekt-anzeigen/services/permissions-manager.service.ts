import {Injectable} from '@angular/core';
import {PermissionsBase} from '../permissions/permissions-base';
import {PermissionType, Role} from '../model/auth';
import {PermissionsFactory} from '../permissions/permissions-factory';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsManagerService {
  private permissions!: PermissionsBase;

  private currentPermissionsSubject = new Subject<PermissionsBase>();

  private currentPermissions = this.currentPermissionsSubject.asObservable();

  isGranted(permission: PermissionType): boolean {
    const permissions = PermissionsFactory.getInstance()!.permissions;
    for (const perm of permissions) {
      if (perm === permission) {
        return true;
      }
    }
    return false;
  }

  authAs(role: Role): void {
    const currentRole = (role === null) ? Role.UNKNOWN : role;
    localStorage.setItem('role', currentRole);
    this.permissions = PermissionsFactory.getInstance();
    this.currentPermissionsSubject.next(this.permissions);
  }

  getPermissions(): Observable<PermissionsBase> {
    return this.currentPermissions;
  }
}
