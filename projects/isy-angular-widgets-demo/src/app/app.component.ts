import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserInfo} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import data from '../assets/permissions.json';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MegaMenuItem, MenuItem, PrimeNGConfig, Translation} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from './shared/services/menu-translation.service';
import {WidgetsTranslation} from '../../../isy-angular-widgets/src/lib/i18n/widgets-translation';
import {WidgetsConfigService} from '../../../isy-angular-widgets/src/lib/i18n/widgets-config.service';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  items: MegaMenuItem[] = [];
  sidebarItems: MenuItem[] = [];
  primeNGI18nSubscription: Subscription;
  isyAngularWidgetsI18nSubscription: Subscription;
  selectedLanguage: string = 'de';

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    public translate: TranslateService,
    private primeNGConfig: PrimeNGConfig,
    private widgetsConfigService: WidgetsConfigService,
    private menuTranslationService: MenuTranslationService
  ) {

    // Add translation
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');

    // Set PrimeNG translation
    this.primeNGI18nSubscription = this.translate.stream('primeng').subscribe((data: Translation) => {
      this.primeNGConfig.setTranslation(data);
    });

    // Set Isy Angular Widgets translation
    this.isyAngularWidgetsI18nSubscription = this.translate.stream('isyAngularWidgets').subscribe((data: WidgetsTranslation) => {
      this.widgetsConfigService.setTranslation(data);
    });
  }

  // Change language and save it in local storage
  changeLanguage(language: string):void {
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());
    this.securityService.setPermissions(data);

    this.changeLanguage(this.selectedLanguage);

    this.translate.onLangChange.subscribe(() => {
      this.menuTranslationService.translateMenuItems(navigationMenu).then(items => {
        this.sidebarItems = items;
      }).catch(console.error);
      this.menuTranslationService.translateMegaMenuItems(applicationMenu).then(items => {
        this.items = items;
      }).catch(console.error);
    });
  }
  ngOnDestroy(): void {
    if (this.primeNGI18nSubscription) {
      this.primeNGI18nSubscription.unsubscribe();
    }
  }

  userInfo?: UserInfo = {
    displayName: 'Max Mustermann'
  };

  getLanguageIcon(language: string): string {
    switch (language) {
      case 'en':
        return 'gb';
      default:
        return language;
    }
  }

}
