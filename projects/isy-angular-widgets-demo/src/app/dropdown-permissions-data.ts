interface DropdownPermissionData {
  role: string;
  permission: string;
}

export const dropdownPermissionsData: DropdownPermissionData[] = [
  {
    role: 'Admin',
    permission: 'admin'
  },
  {
    role: 'User',
    permission: 'user'
  }
];
