import { TestBed } from '@angular/core/testing';

import { PermissionsManagerService } from './permissions-manager.service';

describe('PermissionsManagerService', () => {
  let service: PermissionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
