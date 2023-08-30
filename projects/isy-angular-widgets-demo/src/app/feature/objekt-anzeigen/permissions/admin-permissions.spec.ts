import {AdminPermissions} from './admin-permissions';
import {ADMIN_PERMISSIONS} from '../data/permissions-data';

describe('AdminPermissions', ()=> {
  const adminPermissions = new AdminPermissions();

  it('creates', ()=> {
    expect(adminPermissions).toBeTruthy();
  });

  it('expects correctly permissions', ()=> {
    expect(adminPermissions.permissions).toEqual(ADMIN_PERMISSIONS);
  });
});
