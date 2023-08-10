import {Component} from '@angular/core';
import {widgetMenuItems} from './data/menus';
import {widgetBackgroundColors} from './data/menu-colors';
import {barChartData, lineStyleChartData, lineChartData, stackedChartData} from './data/chart-data';
import {stackedOptions} from './data/chart-configs';

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
  protected readonly stackedChartData = stackedChartData;
  protected readonly stackedOptions = stackedOptions;
}
