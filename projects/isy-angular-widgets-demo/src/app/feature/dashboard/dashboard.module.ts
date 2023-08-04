import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {CardModule} from 'primeng/card';
import {DashboardRoutingModule} from './dashboard.routing.module';
import {
  DashboardInformationsbereichComponent
} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';
import {
  DashboardLinksnavigationComponent
} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {MegaMenuModule} from 'primeng/megamenu';
import {PanelModule} from 'primeng/panel';
import {FormsModule} from '@angular/forms';
import {PanelMenuModule} from 'primeng/panelmenu';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLinksnavigationComponent,
    DashboardInformationsbereichComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DashboardRoutingModule,
    MegaMenuModule,
    PanelModule,
    FormsModule,
    PanelMenuModule
  ]
})
export class DashboardModule { }
