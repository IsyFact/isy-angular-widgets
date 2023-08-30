import {PermissionsFactory} from './permissions-factory';
import {ADMIN_PERMISSIONS, UNKNOWN_PERMISSIONS, USER_PERMISSIONS} from '../data/permissions-data';
import {TestBed} from '@angular/core/testing';

describe('PermissionsFactory', ()=> {
  /**
   * Is adding role to local storage
   * @param value Role value
   */
  function addRoleToLocalStorage(value: string): void {
    localStorage.setItem('role', value);
  }

  /**
   * Is clearing the local storage
   */
  function removeRoleFromLocalStorage(): void {
    localStorage.removeItem('role');
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: []
    })
      .compileComponents();
    removeRoleFromLocalStorage();
  });

  afterEach(() => {
    removeRoleFromLocalStorage();
  });

  it('creates', ()=> {
    expect(PermissionsFactory).toBeTruthy();
  });

  it('admin role is set', ()=> {
    addRoleToLocalStorage('admin');
    const instance = PermissionsFactory.getInstance();
    expect(instance.permissions).toEqual(ADMIN_PERMISSIONS);
  });

  it('user role is set', ()=> {
    addRoleToLocalStorage('user');
    const instance = PermissionsFactory.getInstance();
    expect(instance.permissions).toEqual(USER_PERMISSIONS);
  });

  it('unknown role is set', ()=> {
    addRoleToLocalStorage('unknown');
    const instance = PermissionsFactory.getInstance();
    expect(instance.permissions).toEqual(UNKNOWN_PERMISSIONS);
  });
});
