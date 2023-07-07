import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserInfo} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import data from '../assets/permissions.json';
import {applicationMenu} from './application-menu';
import {navigationMenu} from './navigation-menu';
import {ActivationStart, Router} from '@angular/router';
import {Subscription, filter, firstValueFrom} from 'rxjs';
import {MegaMenuItem, MenuItem, PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  items: MegaMenuItem[] = [];
  sidebarItems: MenuItem[] = []
  title!: string;
  subTitle!: string;
  subscription: Subscription;
  selectedLanguage: string = 'de';

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
    translate.setDefaultLang('en');



    // Set PrimeNG translation
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.primeNGConfig.setTranslation(data);
    });
  }

  // Change language and save it in local storage
   changeLanguage(language: string) {
    this.translate.use(language)
  }

  async ngOnInit(): Promise<void> {
    this.securityService.setRoles(this.userInfoPublicService.getUserInfo());
    this.securityService.setPermissions(data);

    this.changeLanguage(this.selectedLanguage);

    this.translate.onLangChange.subscribe(async () => {
      this.sidebarItems = await this.translateMenuItems(navigationMenu);
      this.items = await this.translateMegaMenuItems(applicationMenu);
    });
  }

  async translateMenuItems(untranslatedItems: MenuItem[]): Promise<MenuItem[]> {
    const translatedItems = []

    for(let i in untranslatedItems) {
      const untranslatedItem = untranslatedItems[i]
      const translatedItem = Object.assign({}, untranslatedItem)

      translatedItem.label = await firstValueFrom(this.translate.get(untranslatedItem.label as string))


      console.log(`${this.translate.currentLang}: ${translatedItem.label}`)

      if(translatedItem.items) {
        translatedItem.items = await this.translateMenuItems(translatedItem.items)
      }

      translatedItems.push(translatedItem)
    }

    return translatedItems
  }

  async translateMegaMenuItems(untranslatedItems: MegaMenuItem[]): Promise<MegaMenuItem[]> {
    const translatedItems = []

    for(let i in untranslatedItems) {
      const untranslatedItem = untranslatedItems[i]
      const translatedItem = Object.assign({}, untranslatedItem)

      translatedItem.label = await firstValueFrom(this.translate.get(untranslatedItem.label as string))

      if(translatedItem.items) {
        const translatedSubItems = []

        for(let j in translatedItem.items) {
          translatedSubItems.push(await this.translateMenuItems(translatedItem.items[j]))
        }

        translatedItem.items = translatedSubItems
      }

      translatedItems.push(translatedItem)
    }

    return translatedItems
  }

  // translateMegaMenuItems(untranslatedItems: MegaMenuItem[]): MegaMenuItem[] {
  //   return untranslatedItems.map(item => {
  //     item.label = this.translate.instant(item.label as string);
  //
  //     if (item.items) {
  //       item.items = item.items.map(megaMenuItem => {
  //         return this.translateMenuItems(megaMenuItem)
  //       })
  //     }
  //
  //     return item
  //   })
  // }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  userInfo?: UserInfo = {
    displayName: 'Max Mustermann'
  };

  getLanguageIcon(language: string) {
    switch (language) {
      case 'en':
        return 'gb'
      default:
        return language
    }
  }

}
