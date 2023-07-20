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
import {MenuTranslationService} from '../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';
import {NotificationService} from './shared/services/notification.service';
import {TOAST_MESSAGE, TOAST_SEVERITY, TOAST_SUMMARY} from './shared/model/toast';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  items: MegaMenuItem[] = applicationMenu;
  sidebarItems: MenuItem[] = [];
  primeNGI18nSubscription: Subscription;
  selectedLanguage: string = 'de';

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    public translate: TranslateService,
    private primeNGConfig: PrimeNGConfig,
    private menuTranslationService: MenuTranslationService,
    private notificationService: NotificationService
  ) {

    // Add translation
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');

    // Set PrimeNG translation
    this.primeNGI18nSubscription = this.translate.stream('primeng').subscribe(data => {
      this.primeNGConfig.setTranslation(data as Translation);
    });
  }

  // Change language and save it in local storage
  changeLanguage(language: string):void {
    this.translate.use(language);
  }

  ngOnInit(): void{
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());
    this.securityService.setPermissions(data);

    this.changeLanguage(this.selectedLanguage);

    this.translate.onLangChange.subscribe(() => {
      this.menuTranslationService.translateMenuItems(navigationMenu).then(items => {
        this.sidebarItems = items;
      }).catch(()=> {
        this.notificationService.buildMessage(
          TOAST_SEVERITY.ERROR,
          TOAST_SUMMARY.ERROR,
          TOAST_MESSAGE.ERROR_LOADING_ITEMS
        );
      });
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
