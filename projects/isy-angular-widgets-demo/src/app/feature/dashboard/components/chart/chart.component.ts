import {Component, Input, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from '../../model/model';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'demo-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  @ViewChild('chart') chart!: UIChart;

  @Input() type!: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | undefined;

  @Input() data!: ChartData;

  @Input() options?: ChartOptions;
}
