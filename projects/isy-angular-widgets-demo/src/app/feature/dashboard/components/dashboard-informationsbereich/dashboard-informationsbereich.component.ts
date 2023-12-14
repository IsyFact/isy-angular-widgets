import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {informationsbereichMenu} from './informationsbereich-menu';

@Component({
  selector: 'demo-dashboard-informationsbereich',
  templateUrl: './dashboard-informationsbereich.component.html'
})
export class DashboardInformationsbereichComponent implements OnInit {
  private readonly selectedLanguage: string = 'de';

  items: MenuItem[] = [];

  constructor(
    public translate: TranslateService,
    private menuTranslationService: MenuTranslationService
  ) {}

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
