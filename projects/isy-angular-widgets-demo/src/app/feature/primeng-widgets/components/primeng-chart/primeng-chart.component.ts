import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
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
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-primeng-chart',
  templateUrl: './primeng-chart.component.html',
  imports: [ChartModule, DividerModule, SectionHeadingComponent]
})
export class PrimengChartComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);

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

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }
}
