import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';
import {informationsbereichMenu} from './informationsbereich-menu';

@Component({
  selector: 'demo-dashboard-informationsbereich',
  templateUrl: './dashboard-informationsbereich.component.html',
  styleUrls: ['./dashboard-informationsbereich.component.scss']
})
export class DashboardInformationsbereichComponent implements OnInit{
  items: MenuItem[] = [];
  selectedLanguage: string = 'de';

  constructor(public translate: TranslateService,
    private menuTranslationService: MenuTranslationService) {
  }

  ngOnInit(): void {
    this.loadMenuItems(informationsbereichMenu);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(informationsbereichMenu);
    });

    this.changeLanguage(this.selectedLanguage);
  }

  loadMenuItems(items: MenuItem[]): void {
    void this.menuTranslationService.translateMenuItems(items).then(items => {
      this.items = items;
    });
  }

  changeLanguage(language: string):void {
    this.translate.use(language);
  }

  protected readonly informationsbereichMenu = informationsbereichMenu;
}