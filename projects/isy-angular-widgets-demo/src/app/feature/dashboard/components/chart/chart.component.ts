import {Component, Input, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from '../../model/model';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'demo-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  @ViewChild('chart') chart!: UIChart;

  @Input() type!: string;

  @Input() data!: ChartData;

  @Input() options?: ChartOptions;
}
