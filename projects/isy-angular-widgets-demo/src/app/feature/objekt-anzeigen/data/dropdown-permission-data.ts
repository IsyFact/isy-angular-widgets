import {Permission} from '../model/permission';
import {Role} from '../model/auth';

export const personsWithPermissions: Permission[] = [
  {
    title: 'Unberechtigt',
    role: Role.USER
  },
  {
    title: 'Berechtigt',
    role: Role.ADMIN
  }
];
