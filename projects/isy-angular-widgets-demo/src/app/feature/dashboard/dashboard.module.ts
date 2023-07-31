import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import { QuicklinkComponent } from './components/quicklink/quicklink.component';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [DashboardComponent, QuicklinkComponent],
  imports: [
    CommonModule,
    CardModule
  ]
})
export class DashboardModule { }
