import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {linksnavigationMenu} from './linksnavigation-menu';
import {TranslateService} from '@ngx-translate/core';
import {PanelMenuModule} from 'primeng/panelmenu';

@Component({
  standalone: true,
  selector: 'demo-dashboard-linksnavigation',
  templateUrl: './dashboard-linksnavigation.component.html',
  imports: [PanelMenuModule]
})
export class DashboardLinksnavigationComponent implements OnInit {
  private readonly selectedLanguage: string = 'de';

  items: MenuItem[] = [];

  translate = inject(TranslateService);

  private readonly menuTranslationService = inject(MenuTranslationService);

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
