import {Injectable} from '@angular/core';

/**
 * Contains information about a user, mostly used for the currently logged-in user.
 */
export interface UserInfo {

  /**
   * The technical user ID.
   */
  userId?: string;

  /**
   * The roles associated with the user.
   */
  roles?: string[];

  /**
   * The name of the user to be shown in GUI.
   */
  displayName?: string;
}

/**
 * An abstract service to provide a concrete implementation for {@link UserInfo} gathering.
 */
@Injectable()
export abstract class UserInfoService {

  /**
   * Returns the user info object.
   * Necessary server calls should be implemented here.
   */
  abstract getUserInfo() : UserInfo;
}
