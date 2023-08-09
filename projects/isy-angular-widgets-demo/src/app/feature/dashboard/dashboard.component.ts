import {Component} from '@angular/core';
import {bereichA, bereichB, bereichC, bereichD} from './menus';

@Component({
  selector: 'demo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected readonly widgetMenuItems = [bereichA, bereichB, bereichC, bereichD];
}
