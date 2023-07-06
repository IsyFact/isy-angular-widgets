import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UserInfo} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import data from '../assets/permissions.json';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {ActivationStart, Router} from '@angular/router';
import {Subscription, filter} from 'rxjs';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly items = applicationMenu;
  readonly sidebarItems: MenuItem[] = navigationMenu;
  title!: string;
  subTitle!: string;
  subscription: Subscription;
  localLang!: string;
  
  constructor(
    private router: Router,
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    public translate: TranslateService,
    public primeNGConfig: PrimeNGConfig,
  ) {
    router.events.pipe(
      filter((e): e is ActivationStart => e instanceof ActivationStart))
      .subscribe((event: ActivationStart) => {
        this.title = event.snapshot.data?.title as string;
        this.subTitle = event.snapshot.data?.subTitle as string;
      });
    
    // Add translation
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('de');
    translate.use('de');

    // Set PrimeNG translation
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.primeNGConfig.setTranslation(data);
    });
  }  

  // Change language and save it in local storage
  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
    window.location.reload();
  }

  ngOnInit(): void {
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());
    this.securityService.setPermissions(data);
    this.localLang = localStorage.getItem('lang') as string;
    this.translate.use(this.localLang);
  }

  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

  userInfo?: UserInfo = {
    displayName: 'Max Mustermann'
  };
}
