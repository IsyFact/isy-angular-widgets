import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UserInfo} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {Subscription} from 'rxjs';
import {MegaMenuItem, MenuItem, PrimeNGConfig, Translation} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from './shared/services/menu-translation.service';
import {WidgetsTranslation} from '../../../isy-angular-widgets/src/lib/i18n/widgets-translation';
import {WidgetsConfigService} from '../../../isy-angular-widgets/src/lib/i18n/widgets-config.service';
import {permissions} from './app.permission';

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

  constructor(
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    public translate: TranslateService,
    private primeNGConfig: PrimeNGConfig,
    private widgetsConfigService: WidgetsConfigService,
    private menuTranslationService: MenuTranslationService,
    private renderer: Renderer2
  ) {
    // Add translation
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');

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
      this.renderer.setAttribute(document.documentElement, 'lang', langEvent.lang);
    });
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
