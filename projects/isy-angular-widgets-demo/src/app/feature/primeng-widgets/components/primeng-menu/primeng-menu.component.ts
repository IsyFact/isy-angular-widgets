import {Component} from '@angular/core';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {electronicData, megaMenuProductData} from '../../data/product';
import {contextMenuData, fileContainerData, menuBarData, optionData, tabMenuData} from '../../data/file-option';
import {personalData} from '../../data/organization';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {StepsModule} from 'primeng/steps';
import {TabsModule} from 'primeng/tabs';
import {DividerModule} from 'primeng/divider';
import {MenubarModule} from 'primeng/menubar';
import {MegaMenuModule} from 'primeng/megamenu';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MenuModule} from 'primeng/menu';

@Component({
  standalone: true,
  selector: 'demo-primeng-menu',
  templateUrl: './primeng-menu.component.html',
  imports: [
    BreadcrumbModule,
    StepsModule,
    TabsModule,
    DividerModule,
    MenubarModule,
    MegaMenuModule,
    PanelMenuModule,
    TieredMenuModule,
    ContextMenuModule,
    MenuModule
  ]
})
export class PrimengMenuComponent {
  electronics: MenuItem[] = electronicData;
  contextMenuOption: MenuItem[] = contextMenuData;
  option: MenuItem[] = optionData;
  menuBarOption: MenuItem[] = menuBarData;
  megaMenuOptions: MegaMenuItem[] = megaMenuProductData;
  fileContainerOptions: MenuItem[] = fileContainerData;
  stepItem: MenuItem[] = personalData;
  activeIndex: number = 0;
  tabMenuOption: MenuItem[] = tabMenuData;

  onActiveIndexChange(event: number): void {
    this.activeIndex = event;
  }
}
