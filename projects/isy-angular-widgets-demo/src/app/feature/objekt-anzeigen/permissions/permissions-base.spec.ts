import {PermissionsBase} from './permissions-base';
import {PermissionType} from '../model/auth';

const permissions = [
  PermissionType.CREATE
];

class TestClass extends PermissionsBase {
  constructor() {
    super();
    this.permissions = permissions;
  }
}
describe('PermissionsBase', () => {
  let testClass: TestClass;

  beforeEach(() => {
    testClass = new TestClass();
  });

  it('permissions set correctly', () => {
    expect(testClass.permissions).toEqual(permissions);
  });
});
