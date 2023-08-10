import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';

@Component({
  selector: 'demo-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss']
})
export class DashboardWidgetComponent implements OnInit {
  @Input() menuItems!: MenuItem[];
  @Input() backgroundColor!: string;
  private selectedLanguage: string = 'de';
  items: MenuItem[] = [];

  constructor(public translate: TranslateService,
    private menuTranslationService: MenuTranslationService) {
  }

  ngOnInit(): void {
    this.loadMenuItems(this.menuItems);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(this.menuItems);
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
}
