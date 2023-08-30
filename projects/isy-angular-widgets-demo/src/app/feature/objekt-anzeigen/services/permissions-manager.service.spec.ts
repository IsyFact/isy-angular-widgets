import {TestBed} from '@angular/core/testing';

import {PermissionsManagerService} from './permissions-manager.service';
import {PermissionType} from '../model/auth';

describe('PermissionsManagerService', () => {
  let service: PermissionsManagerService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be granted', () => {
    const isGranted = service.isGranted([PermissionType.READ]);
    expect(isGranted).toBeTrue();
  });

  it('should not be granted', () => {
    const isGranted = service.isGranted([PermissionType.EDIT]);
    expect(isGranted).toBeFalse();
  });
});
