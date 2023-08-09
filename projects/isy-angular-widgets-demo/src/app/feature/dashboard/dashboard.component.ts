import {Component} from '@angular/core';
import {widgetMenuItems} from './menus';
import {widgetBackgroundColors} from './menu-colors';
import {barChartData, lineStyleChartData, lineChartData, doughnutChartData} from './chart-data';

@Component({
  selector: 'demo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected readonly widgetMenuItems = widgetMenuItems;
  protected readonly widgetBackgroundColors = widgetBackgroundColors;
  protected readonly barChartData = barChartData;
  protected readonly lineChartData = lineChartData;
  protected readonly lineStyleChartData = lineStyleChartData;
  protected readonly doughnutChartData = doughnutChartData;
}
