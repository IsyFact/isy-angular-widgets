interface DropdownPermissionData {
  display: string;
  permission: string;
}

export const dropdownPermissionsData: DropdownPermissionData[] = [
  {
    display: 'Nein',
    permission: ''
  },
  {
    display: 'Ja',
    permission: 'secretFieldsInputSwitch'
  }
];
