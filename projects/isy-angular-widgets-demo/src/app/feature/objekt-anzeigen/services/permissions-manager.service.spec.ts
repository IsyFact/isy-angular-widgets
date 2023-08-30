import {TestBed} from '@angular/core/testing';

import {PermissionsManagerService} from './permissions-manager.service';
import {PermissionType, Role} from '../model/auth';
import {ADMIN_PERMISSIONS} from '../data/permissions-data';

describe('PermissionsManagerService', () => {
  /**
   * Setting up admin role
   */
  function setupAdminRole(): void {
    localStorage.setItem('role', 'admin');
  }

  let service: PermissionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsManagerService);
    setupAdminRole();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('grants access', () => {
    const isGranted = service.isGranted([PermissionType.READ]);
    expect(isGranted).toBeTrue();
  });

  it('dont grants access', () => {
    const isGranted = service.isGranted([PermissionType.EDIT]);
    expect(isGranted).toBeTrue();
  });

  it('must have admin role', () => {
    const role = Role.ADMIN;
    service.authAs(role);

    const item = localStorage.getItem('role');
    expect(item).toEqual(role);
  });

  it('has admin permissions', () => {
    const role = Role.ADMIN;
    service.authAs(role);

    const roleItem = localStorage.getItem('role');
    expect(roleItem).toEqual(role);

    service.getPermissionsBase().subscribe(permissionsBase => {
      expect(permissionsBase.permissions).toEqual(ADMIN_PERMISSIONS);
    });
  });
});
