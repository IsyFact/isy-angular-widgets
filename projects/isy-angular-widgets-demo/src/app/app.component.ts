import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {UserInfo} from '@isy-angular-widgets/api/userinfo';
import {SecurityService} from '@isy-angular-widgets/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {Subscription, filter} from 'rxjs';
import {MegaMenuItem, MenuItem, PrimeNGConfig, Translation} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from './shared/services/menu-translation.service';
import {WidgetsTranslation} from '@isy-angular-widgets/i18n/widgets-translation';
import {WidgetsConfigService} from '@isy-angular-widgets/i18n/widgets-config.service';
import {permissions} from './app.permission';
import {DOCUMENT} from '@angular/common';
import {PageTitleService} from './shared/services/page-title.service';
import {NavigationEnd, Router, RouterEvent, Event} from '@angular/router';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  items: MegaMenuItem[] = [];
  sidebarItems: MenuItem[] = [];
  userInfo: UserInfo = {
    displayName: 'Max Mustermann'
  };
  primeNGI18nSubscription: Subscription;
  isyAngularWidgetsI18nSubscription: Subscription;
  selectedLanguage: string = 'de';
  focusHasBeenSet?: boolean;

  constructor(
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    public translate: TranslateService,
    private primeNGConfig: PrimeNGConfig,
    private widgetsConfigService: WidgetsConfigService,
    private menuTranslationService: MenuTranslationService,
    public pageTitleService: PageTitleService,
    public router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Add translation
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('de');

    // Set PrimeNG translation
    this.primeNGI18nSubscription = this.translate.stream('primeng').subscribe((data: Translation) => {
      this.primeNGConfig.setTranslation(data);
    });

    // Set Isy Angular Widgets translation
    this.isyAngularWidgetsI18nSubscription = this.translate
      .stream('isyAngularWidgets')
      .subscribe((data: WidgetsTranslation) => {
        this.widgetsConfigService.setTranslation(data);
      });

    // Updating the HTML tag's lang attribute to improve website accessibility, enabling assistive technologies to correctly interpret and pronounce the content language.
    this.translate.onLangChange.subscribe((langEvent) => {
      this.document.documentElement.lang = langEvent.lang;
    });

    // Call the setupPageTitle method of the pageTitleService to initialize the page title
    this.pageTitleService.setupPageTitle();

    // Reset focusHasBeenSet flag on navigation end
    this.router.events.pipe(filter((event: Event | RouterEvent) => event instanceof NavigationEnd)).subscribe(() => {
      this.focusHasBeenSet = false;
    });

    // Subscribe to requestFocusChange event
    this.pageTitleService.requestFocusChange.subscribe((id) => {
      // Set focus on input element if focusHasBeenSet is false
      if (!this.focusHasBeenSet) {
        this.setFocusOnInput(id);
      }
    });
  }

  /**
   * Handles the keydown event on the window.
   * If the Tab key is pressed and the focus has not been set, it prevents the default behavior
   * and triggers the requestFocusChange event in the pageTitleService.
   * @param event The KeyboardEvent object.
   */
  @HostListener('keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !this.focusHasBeenSet) {
      event.preventDefault();
      // Replace 'id' with the id of the input element you want to focus on e.g. on 'Objekt suchen' page
      this.pageTitleService.requestFocusChange.next('id');
    }
  }

  /**
   * Sets focus on the input element with the specified id.
   * @param id The id of the input element.
   */
  setFocusOnInput(id: string): void {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement?.focus();
      this.focusHasBeenSet = true;
    }
  }

  changeLanguage(language: string): void {
    // Since Angular and PrimeNG 16 dropdown emits change events if angular form module writes initial null values.
    // Currently, it's not clear, if firing the onChange Event from PrimeNG on initial null values or triggering value accessors for initial null values from Angular Forms is inappropriate
    if (language) {
      this.translate.use(language);
    }
  }

  ngOnInit(): void {
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());

    // Permission to role mapping could also be loaded from server or a file
    this.securityService.setPermissions(permissions);

    // Solution with promise usage needs to many lines of code and promise is not needed for this use case
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.translate.onLangChange.subscribe(async () => {
      this.sidebarItems = await this.menuTranslationService.translateMenuItems(navigationMenu);
      this.items = await this.menuTranslationService.translateMegaMenuItems(applicationMenu);
    });
  }

  ngOnDestroy(): void {
    if (this.primeNGI18nSubscription) {
      this.primeNGI18nSubscription.unsubscribe();
    }
  }

  getLanguageIcon(language: string): string {
    if (language === 'en') {
      return 'gb';
    }
    return language;
  }

  selectPermission(role: string): void {
    this.userInfo.roles = [role];
    this.securityService.setRoles(this.userInfo);
  }
}
