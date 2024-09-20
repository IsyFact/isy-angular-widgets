import {Component} from '@angular/core';
import {MegaMenuItem, MenuItem} from 'primeng/api';

import {electronicData, megaMenuProductData} from '../../data/product';
import {contextMenuData, fileContainerData, menuBarData, optionData, tabMenuData} from '../../data/file-option';
import {personalData} from '../../data/organization';

@Component({
  selector: 'demo-primeng-menu',
  templateUrl: './primeng-menu.component.html',
  styleUrl: './primeng-menu.component.scss'
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
