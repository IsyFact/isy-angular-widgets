import {Component, Input} from '@angular/core';
import {ChartData, StackedOptions} from '../../model/model';

@Component({
  selector: 'demo-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() type!: string;

  @Input() data!: ChartData;

  @Input() options?: StackedOptions;
}
