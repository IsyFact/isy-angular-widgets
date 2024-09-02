import {PermissionMaps} from '@isy-angular-widgets/public-api';

// Permission to role mapping could also be loaded from server
export const permissions: PermissionMaps = {
  routes: {
    dashboard: ['admin', 'user'],
    'objekt-anzeigen': ['admin'],
    'objekt-suchen': ['admin', 'user'],
    'primeng-widgets': ['admin', 'user']
  },
  elements: {
    personenSuche: ['admin'],
    secretFieldsInputSwitch: ['admin']
  }
};
