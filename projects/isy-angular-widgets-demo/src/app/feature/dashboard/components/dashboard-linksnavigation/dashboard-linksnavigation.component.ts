import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';
import {linksnavigationMenu} from './linksnavigation-menu';

@Component({
  selector: 'demo-dashboard-linksnavigation',
  templateUrl: './dashboard-linksnavigation.component.html',
  styleUrls: ['./dashboard-linksnavigation.component.scss']
})
export class DashboardLinksnavigationComponent implements OnInit {
  items: MenuItem[] = [];
  selectedLanguage: string = 'de';

  constructor(public translate: TranslateService,
    private menuTranslationService: MenuTranslationService) {
  }

  ngOnInit(): void {
    this.loadMenuItems(linksnavigationMenu);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(linksnavigationMenu);
    });

    this.changeLanguage(this.selectedLanguage);
  }

  loadMenuItems(items: MenuItem[]): void {
    void this.menuTranslationService.translateMenuItems(items).then(items => {
      this.items = items;
    });
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  protected readonly linksnavigationMenu = linksnavigationMenu;
}