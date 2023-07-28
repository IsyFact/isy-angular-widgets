import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardViewComponent} from './dashboard-view.component';
import {DashboardModule} from '../../../../../isy-angular-widgets/src/lib/dashboard/dashboard.module';

@NgModule({
  declarations: [
    DashboardViewComponent
  ],
  imports: [
    CommonModule,
    DashboardModule
  ]
})
export class DashboardViewModule { }
