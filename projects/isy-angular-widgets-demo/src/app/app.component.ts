import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {UserInfo} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import data from '../assets/permissions.json';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {ActivationStart, Router} from '@angular/router';
import {filter} from 'rxjs';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import '@angular/localize/init';
import { Translate } from './shared/model/translate.model';
import { TranslateService } from './shared/services/translate.service';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly items = applicationMenu;
  readonly sidebarItems: MenuItem[] = navigationMenu;
  title!: string;
  subTitle!: string;
  translate!: Translate;

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private userInfoPublicService: UserInfoPublicService,
    private primengConfig: PrimeNGConfig,
    private translateService: TranslateService,
    @Inject(LOCALE_ID) private activeLocale: Locale
  ) {
    router.events.pipe(
      filter((e): e is ActivationStart => e instanceof ActivationStart))
      .subscribe((event: ActivationStart) => {
        this.title = event.snapshot.data?.title as string;
        this.subTitle = event.snapshot.data?.subTitle as string;
      });
  }

  ngOnInit(): void {
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());
    this.securityService.setPermissions(data);
    this.translate = this.translateService.translateL(
      this.activeLocale
    );
    this.primengConfig.setTranslation(this.translate);
  }

  userInfo?: UserInfo = {
    displayName: 'Max Mustermann'
  };
}
