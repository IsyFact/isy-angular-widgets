interface DropdownPermissionData {
  display: string;
  permission: string;
}

export const dropdownPermissionsData: DropdownPermissionData[] = [
  {
    display: 'Admin',
    permission: 'admin'
  },
  {
    display: 'User',
    permission: 'user'
  }
];
