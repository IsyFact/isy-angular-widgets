import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {linksnavigationMenu} from './linksnavigation-menu';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'demo-dashboard-linksnavigation',
  templateUrl: './dashboard-linksnavigation.component.html',
  standalone: false
})
export class DashboardLinksnavigationComponent implements OnInit {
  private readonly selectedLanguage: string = 'de';

  items: MenuItem[] = [];

  constructor(
    public translate: TranslateService,
    private readonly menuTranslationService: MenuTranslationService
  ) {}

  ngOnInit(): void {
    this.loadMenuItems(linksnavigationMenu);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(linksnavigationMenu);
    });

    this.changeLanguage(this.selectedLanguage);
  }

  loadMenuItems(items: MenuItem[]): void {
    void this.menuTranslationService.translateMenuItems(items).then((items) => {
      this.items = items;
    });
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
