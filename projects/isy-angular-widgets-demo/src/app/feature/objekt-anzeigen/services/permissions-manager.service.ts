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

  isGranted(neededPermission: PermissionType[]): boolean {
    const permissionsOfEntity = PermissionsFactory.getInstance()!.permissions;
    return neededPermission.some(entry => permissionsOfEntity.includes(entry));
  }

  authAs(role: Role): void {
    const currentRole = (role === null) ? Role.UNKNOWN : role;
    localStorage.setItem('role', currentRole);
    this.permissions = PermissionsFactory.getInstance();
    this.currentPermissionsSubject.next(this.permissions);
  }

  getPermissionsBase(): Observable<PermissionsBase> {
    return this.currentPermissions;
  }
}
