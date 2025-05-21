import {Injectable} from '@angular/core';
import {UserInfo, UserInfoService} from '@isy-angular-widgets/api/userinfo';

@Injectable({
  providedIn: 'root'
})
export class UserInfoPublicService implements UserInfoService {
  getUserInfo(): UserInfo {
    return {
      userId: '1',
      roles: ['admin', 'user'],
      displayName: 'Nutzer'
    };
  }
}
