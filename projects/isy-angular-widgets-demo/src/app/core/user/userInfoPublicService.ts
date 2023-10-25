import {Injectable} from '@angular/core';
import {UserInfo, UserInfoService} from '../../../../../isy-angular-widgets/src/lib/api/userinfo';

@Injectable()
export class UserInfoPublicService implements UserInfoService {
  getUserInfo(): UserInfo {
    return {
      userId: '1',
      roles: ['admin', 'user'],
      displayName: 'Nutzer'
    };
  }
}
