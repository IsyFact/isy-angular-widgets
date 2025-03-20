import {FileOption} from '../model/file-option';
import {MenuItem, ToastMessageOptions} from 'primeng/api';

export const fileOptionData: FileOption[] = [
  {
    key: '0',
    label: 'Documents',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    children: [
      {
        key: '0-0',
        label: 'Work',
        data: 'Work Folder',
        icon: 'pi pi-fw pi-cog',
        children: [
          {key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document'},
          {key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document'}
        ]
      },
      {
        key: '0-1',
        label: 'Home',
        data: 'Home Folder',
        icon: 'pi pi-fw pi-home',
        children: [{key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month'}]
      }
    ]
  },
  {
    key: '1',
    label: 'Events',
    data: 'Events Folder',
    icon: 'pi pi-fw pi-calendar',
    children: [
      {key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting'},
      {key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch'},
      {key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review'}
    ]
  },
  {
    key: '2',
    label: 'Movies',
    data: 'Movies Folder',
    icon: 'pi pi-fw pi-star-fill',
    children: [
      {
        key: '2-0',
        icon: 'pi pi-fw pi-star-fill',
        label: 'Al Pacino',
        data: 'Pacino Movies',
        children: [
          {key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie'},
          {key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie'}
        ]
      },
      {
        key: '2-1',
        label: 'Robert De Niro',
        icon: 'pi pi-fw pi-star-fill',
        data: 'De Niro Movies',
        children: [
          {key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie'},
          {key: '2-1-1', label: 'Untouchables', icon: 'pi pi-fw pi-video', data: 'Untouchables Movie'}
        ]
      }
    ]
  }
];

export const optionData: MenuItem[] = [
  {label: 'Update', icon: 'pi pi-refresh'},
  {label: 'Edit', icon: 'pi pi-pencil'},
  {label: 'Add', icon: 'pi pi-plus'},
  {label: 'Delete', icon: 'pi pi-trash'}
];

export const contextMenuData: MenuItem[] = [
  {label: 'Save', icon: 'pi pi-save'},
  {label: 'Copy', icon: 'pi pi-copy'}
];

export const menuBarData: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home'
  },
  {
    label: 'Features',
    icon: 'pi pi-star'
  },
  {
    label: 'Projects',
    icon: 'pi pi-search',
    items: [
      {
        label: 'Components',
        icon: 'pi pi-bolt'
      },
      {
        label: 'Blocks',
        icon: 'pi pi-server'
      },
      {
        label: 'UI Kit',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Templates',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Apollo',
            icon: 'pi pi-palette'
          },
          {
            label: 'Ultima',
            icon: 'pi pi-palette'
          }
        ]
      }
    ]
  },
  {
    label: 'Contact',
    icon: 'pi pi-envelope'
  }
];

export const fileContainerData: MenuItem[] = [
  {
    label: 'Files',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Documents',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Invoices',
            icon: 'pi pi-file-pdf',
            items: [
              {
                label: 'Pending',
                icon: 'pi pi-stop'
              },
              {
                label: 'Paid',
                icon: 'pi pi-check-circle'
              }
            ]
          },
          {
            label: 'Clients',
            icon: 'pi pi-users'
          }
        ]
      },
      {
        label: 'Images',
        icon: 'pi pi-image',
        items: [
          {
            label: 'Logos',
            icon: 'pi pi-image'
          }
        ]
      }
    ]
  },
  {
    label: 'Cloud',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Upload',
        icon: 'pi pi-cloud-upload'
      },
      {
        label: 'Download',
        icon: 'pi pi-cloud-download'
      },
      {
        label: 'Sync',
        icon: 'pi pi-refresh'
      }
    ]
  },
  {
    label: 'Devices',
    icon: 'pi pi-desktop',
    items: [
      {
        label: 'Phone',
        icon: 'pi pi-mobile'
      },
      {
        label: 'Desktop',
        icon: 'pi pi-desktop'
      },
      {
        label: 'Tablet',
        icon: 'pi pi-tablet'
      }
    ]
  }
];

export const tabMenuData: MenuItem[] = [
  {label: 'Dashboard', icon: 'pi pi-home'},
  {label: 'Transactions', icon: 'pi pi-chart-line'},
  {label: 'Products', icon: 'pi pi-list'},
  {label: 'Messages', icon: 'pi pi-inbox'}
];

export const messageData: ToastMessageOptions[] = [
  {key: 'infoMessage', severity: 'info', detail: 'Info Message'},
  {key: 'successMessage', severity: 'success', detail: 'Success Message'},
  {key: 'warnMessage', severity: 'warn', detail: 'Warning Message'},
  {key: 'errorMessage', severity: 'error', detail: 'Error Message'}
];
