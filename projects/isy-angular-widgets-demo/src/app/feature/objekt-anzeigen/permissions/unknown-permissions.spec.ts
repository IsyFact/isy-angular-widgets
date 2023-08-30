import {UNKNOWN_PERMISSIONS} from '../data/permissions-data';
import {UnknownPermissions} from './unknown-permissions';

describe('UnknownPermissions', ()=> {
  const unknownPermissions = new UnknownPermissions();

  it('creates', ()=> {
    expect(unknownPermissions).toBeTruthy();
  });

  it('expects correctly permissions', ()=> {
    expect(unknownPermissions.permissions).toEqual(UNKNOWN_PERMISSIONS);
  });
});
