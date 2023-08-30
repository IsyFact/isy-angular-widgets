import {PermissionsBase} from './permissions-base';
import {ADMIN_PERMISSIONS} from '../data/permissions-data';

export class TestPermissionsBase extends PermissionsBase {
  constructor() {
    super();
    this.permissions = ADMIN_PERMISSIONS;
  }
}

describe('PermissionsBase', ()=> {
  const testPermissionsBase = new TestPermissionsBase();

  it('creates', ()=> {
    expect(testPermissionsBase).toBeTruthy();
  });

  it('expects correctly permissions', ()=> {
    expect(testPermissionsBase.permissions).toEqual(ADMIN_PERMISSIONS);
  });
});
