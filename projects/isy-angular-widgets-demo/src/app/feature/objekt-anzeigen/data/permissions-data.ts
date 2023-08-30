import {PermissionType} from '../model/auth';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const ADMIN_PERMISSIONS: PermissionType[] = [
  PermissionType.CREATE,
  PermissionType.DELETE,
  PermissionType.READ,
  PermissionType.UPDATE,
  PermissionType.EDIT
];

export const USER_PERMISSIONS: PermissionType[] = [
  PermissionType.READ
];

export const UNKNOWN_PERMISSIONS: PermissionType[] = [];
