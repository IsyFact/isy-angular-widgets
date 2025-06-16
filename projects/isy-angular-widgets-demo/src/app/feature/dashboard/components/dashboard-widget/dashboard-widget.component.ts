import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {PanelMenuModule} from 'primeng/panelmenu';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'demo-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss'],
  imports: [CommonModule, PanelMenuModule]
})
export class DashboardWidgetComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];

  @Input() backgroundColor!: string;

  private readonly selectedLanguage: string = 'de';

  items: MenuItem[] = [];

  constructor(
    public translate: TranslateService,
    private readonly menuTranslationService: MenuTranslationService
  ) {}

  ngOnInit(): void {
    this.loadMenuItems(this.menuItems);

    this.translate.onLangChange.subscribe(() => {
      this.loadMenuItems(this.menuItems);
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
