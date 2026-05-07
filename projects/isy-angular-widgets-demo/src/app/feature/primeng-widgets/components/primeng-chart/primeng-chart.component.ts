import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
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
export class PrimengChartComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

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
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
  }
}
