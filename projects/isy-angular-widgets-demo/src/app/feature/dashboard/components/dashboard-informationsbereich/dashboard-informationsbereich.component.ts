import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {informationsbereichMenu} from './informationsbereich-menu';
import {PanelMenuModule} from 'primeng/panelmenu';

@Component({
  standalone: true,
  selector: 'demo-dashboard-informationsbereich',
  templateUrl: './dashboard-informationsbereich.component.html',
  imports: [PanelMenuModule]
})
export class DashboardInformationsbereichComponent implements OnInit {
  private readonly selectedLanguage: string = 'de';

  items: MenuItem[] = [];

  translate = inject(TranslateService);
  private readonly menuTranslationService = inject(MenuTranslationService);

  ngOnInit(): void {
    this.loadMenuItems(informationsbereichMenu);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(informationsbereichMenu);
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
