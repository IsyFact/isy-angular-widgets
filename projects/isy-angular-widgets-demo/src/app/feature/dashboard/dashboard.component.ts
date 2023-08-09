import {Component} from '@angular/core';
import {widgetMenuItems} from './menus';
import {widgetBackgroundColors} from './menu-colors';

@Component({
  selector: 'demo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected readonly widgetMenuItems = widgetMenuItems;
  protected readonly widgetBackgroundColors = widgetBackgroundColors;
}
