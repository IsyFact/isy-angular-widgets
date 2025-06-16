import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';

export const canActivateAuth: CanActivateFn = (route) => {
  return inject(AuthGuard).canActivate(route);
};
