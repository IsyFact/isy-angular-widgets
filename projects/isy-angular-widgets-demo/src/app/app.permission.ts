import {PermissionMaps} from '@isy-angular-widgets/public-api';

// Permission to role mapping could also be loaded from server
export const permissions: PermissionMaps = {
  routes: {
    dashboard: ['admin', 'user'],
    'objekt-anzeigen': ['admin'],
    'objekt-suchen': ['admin', 'user'],
    'modalarme-patterns': ['admin', 'user'],
    'primeng-widgets': ['admin', 'user'],
    'isy-angular-components': ['admin', 'user']
  },
  elements: {
    personenSuche: ['admin'],
    secretFieldsInputSwitch: ['admin']
  }
};
