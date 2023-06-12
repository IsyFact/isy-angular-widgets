import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MegaMenuItem} from 'primeng/api';
import {UserInfo} from '../api/userinfo';

/**
 * The Anwendungsrahmen that contains general, application independent elements as logos or navigation bars.
 */
@Component({
  selector: 'isy-hauptfenster',
  templateUrl: './hauptfenster.component.html',
  styleUrls: ['./hauptfenster.component.scss']
})
export class HauptfensterComponent   {

  /**
   * Items to be shown in the main menu bar.
   */
  @Input() items: MegaMenuItem[] = [];

  /**
   * Contains information about the user as the name to be displayed.
   */
  @Input() userInfo?: UserInfo;

  /**
   * An URI to the logo image file of the Anbieter der Anwendungslandschaft, e.g. Bundesregierung.
   * Will be displayed in the upper left corner.
   */
  @Input() logoAnbieterAwl: string = '';

  /**
   * An URI to the logo image file of the Anwendungslandschaft.
   */
  @Input() logoAwl: string = '';

  /**
   * The page title to be displayed under the menu bar.
   */
  @Input() title?: string;

  /**
   * Determines whether to show or hide the Linksnavigation, a navigation bar on the left screen side.
   */
  @Input() showLinksnavigation: boolean = false;

  /**
   * Determines whether to show or hide the Informationsbereich, a navigation bar on the right screen side.
   */
  @Input() showInformationsbereich: boolean = false;

  /**
   * Determines whether the user can collapse the Linksnavigation and Informationsbereich.
   */
  @Input() allowSidebarCollapse: boolean = true;

  /**
   * Determines whether the Linksnavigation is currently collapsed.
   */
  @Input() collapsedLinksnavigation: boolean = false;

  /**
   * Determines whether the Informationsbereich is currently collapsed.
   */
  @Input() collapsedInformationsbereich: boolean = false;

  /**
   * Returns the current {@link UserInfo} when the user wants to log out.
   */
  @Input() applicationGroupColor: string = '#A13D6D';

  @Input() linksNavigationCols = 1;

  @Input() informationsbereichCols = 1;

  @Output() logoutEvent = new EventEmitter<UserInfo>();

  get linksNavigationClass(): string {
    return `col-${this.linksNavigationCols} isy-hauptfenster-linksnavigation dont-print`;
  }

  get informationsbereichClass(): string {
    return `col-${this.informationsbereichCols} isy-hauptfenster-informationsbereich dont-print`;
  }
}
