import {USER_PERMISSIONS} from '../data/permissions-data';
import {UserPermissions} from './user-permissions';

describe('UserPermissions', ()=> {
  const userPermissions = new UserPermissions();

  it('creates', ()=> {
    expect(userPermissions).toBeTruthy();
  });

  it('expects correctly permissions', ()=> {
    expect(userPermissions.permissions).toEqual(USER_PERMISSIONS);
  });
});
