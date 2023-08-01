import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {CardModule} from 'primeng/card';
import {DashboardRoutingModule} from './dashboard.routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    CardModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
