import {Permission} from '../model/permission';

export const personsWithPermissions: Permission[] = [
  {
    title: 'Unberechtigt',
    permitted: false
  },
  {
    title: 'Berechtigt',
    permitted: true
  }
];
