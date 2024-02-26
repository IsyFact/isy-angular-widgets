import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MegaMenuItem} from 'primeng/api';
import {UserInfo} from '../api/userinfo';
import {WidgetsConfigService} from '../i18n/widgets-config.service';

/**
 * The Anwendungsrahmen that contains general, application independent elements as logos or navigation bars.
 * The following template references can be used to insert custom HTML:
 * LogoAnbieterAwl - Access to the top left region. Only works if logoAnbieterAwl is not set.
 * LogoAwl - Access to top right region. Only works if logoAwl is not set.
 * Hauptnavigation-Tools - Access to the Menu bar behind the menu items, e.g. for a language picker.
 * Titelzeile - Access to the Titelzeile between Menu and Content. Only works if title is not set.
 * Seitentoolbar - Access to a space right under the Titelzeile, e.g. for some navigation buttons.
 * Linksnavigation - The left sidebar.
 * Informationsbereich - The right sidebar.
 *
 * Content without template references is used as main content.
 */
@Component({
  selector: 'isy-hauptfenster',
  templateUrl: './hauptfenster.component.html',
  styleUrls: ['./hauptfenster.component.scss']
})
export class HauptfensterComponent {
  /**
   * Items to be shown in the main menu bar.
   */
  @Input() items: MegaMenuItem[] = [];

  /**
   * Contains information about the user as the name to be displayed.
   */
  @Input() userInfo?: UserInfo;

  /**
   * A URI to the logo image file of the Anbieter der Anwendungslandschaft, e.g. Bundesregierung.
   * Will be displayed in the upper left corner.
   * For custom HTML, use the "LogoAnbieterAwl" template reference instead.
   */
  @Input() logoAnbieterAwl: string = '';

  /**
   * A URI to the logo image file of the Anwendungslandschaft.
   * Will be displayed in the upper right corner.
   * For custom HTML, use the "LogoAwl" template reference instead.
   */
  @Input() logoAwl: string = '';

  /**
   * The page title to be displayed in the Titelzeile under the menu bar.
   * For custom HTML, use the "Titelzeile" template reference instead.
   */
  @Input() title?: string;

  /**
   * Determines whether to show or hide the Seitentoolbarnavigation, a sticky toolbar at the top of the screen.
   */
  @Input() showSeitentoolbarnavigation: boolean = false;

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

  /**
   * Determines the width of the Linksnavigation, e.g. "15em". Suggested unit is em.
   * Default is 15em.
   */
  @Input() linksNavigationWidth = '15em';

  /**
   * Determines the width of the Informationsbereich, e.g. "15em". Suggested unit is em.
   * Default is 15em.
   */
  @Input() informationsbereichWidth = '15em';

  @Output() logoutEvent = new EventEmitter<UserInfo>();

  constructor(public configService: WidgetsConfigService) {}
}
