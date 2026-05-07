import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
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
export class PrimengMenuComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

  electronics: MenuItem[] = electronicData;
  contextMenuOption: MenuItem[] = contextMenuData;
  option: MenuItem[] = optionData;
  menuBarOption: MenuItem[] = menuBarData;
  megaMenuOptions: MegaMenuItem[] = megaMenuProductData;
  fileContainerOptions: MenuItem[] = fileContainerData;
  stepItem: MenuItem[] = personalData;
  activeIndex: number = 0;
  tabMenuOption: MenuItem[] = tabMenuData;

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
  }

  onActiveIndexChange(event: number): void {
    this.activeIndex = event;
  }
}
