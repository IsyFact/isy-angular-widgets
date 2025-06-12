import {Component} from '@angular/core';
import {ChartData} from '../../../dashboard/model/model';
import {
  barChartData,
  verticalBarChartOptions,
  doughnutChartOptions,
  circledChartData,
  pieChartOptions,
  horizontalBarChartOptions,
  stackedOptions,
  lineChartData,
  lineChartOptions,
  polarAreaChartOptions,
  radarChartData,
  radarChartOptions
} from '../../data/chart';
import {ChartOption} from '../../model/chart';
import {ChartModule} from 'primeng/chart';
import {DividerModule} from 'primeng/divider';

@Component({
  standalone: true,
  selector: 'demo-primeng-chart',
  templateUrl: './primeng-chart.component.html',
  imports: [ChartModule, DividerModule]
})
export class PrimengChartComponent {
  barChartData: ChartData = barChartData;
  verticalBarChartOptions: ChartOption = verticalBarChartOptions;
  horizontalBarChartOptions: ChartOption = horizontalBarChartOptions;
  stackedBarChartOptions: ChartOption = stackedOptions;
  circledChartData: ChartData = circledChartData;
  pieChartOptions: ChartOption = pieChartOptions;
  doughnutChartOptions: ChartOption = doughnutChartOptions;
  polarAreaChartOptions: ChartOption = polarAreaChartOptions;
  lineChartData: ChartData = lineChartData;
  lineChartOptions: ChartOption = lineChartOptions;
  radarChartData: ChartData = radarChartData;
  radarChartOptions: ChartOption = radarChartOptions;
}
