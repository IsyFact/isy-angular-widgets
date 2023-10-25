import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {DashboardWidgetComponent} from './components/dashboard-widget/dashboard-widget.component';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {ChartComponent} from './components/chart/chart.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLinksnavigationComponent,
    DashboardInformationsbereichComponent,
    DashboardWidgetComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DashboardRoutingModule,
    MegaMenuModule,
    PanelModule,
    FormsModule,
    PanelMenuModule,
    ChartModule,
    ButtonModule
  ]
})
export class DashboardModule {}
