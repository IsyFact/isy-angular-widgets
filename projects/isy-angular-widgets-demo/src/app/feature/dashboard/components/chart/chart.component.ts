import {Component, Input, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from '../../model/model';
import {ChartModule, UIChart} from 'primeng/chart';

@Component({
  standalone: true,
  selector: 'demo-chart',
  templateUrl: './chart.component.html',
  imports: [ChartModule]
})
export class ChartComponent {
  @ViewChild('chart') chart!: UIChart;

  @Input() type!: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter';

  @Input() data!: ChartData;

  @Input() options?: ChartOptions;
}
