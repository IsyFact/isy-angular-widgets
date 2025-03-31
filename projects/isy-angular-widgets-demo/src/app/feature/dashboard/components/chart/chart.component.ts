import {Component, Input, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from '../../model/model';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'demo-chart',
  templateUrl: './chart.component.html',
  standalone: false
})
export class ChartComponent {
  @ViewChild('chart') chart!: UIChart;

  @Input() type!: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter';

  @Input() data!: ChartData;

  @Input() options?: ChartOptions;
}
