import {AfterContentInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {barChartData, lineChartData, lineStyleChartData, stackedChartData} from './data/chart-data';
import {widgetBackgroundColors} from './data/menu-colors';
import {widgetMenuItems} from './data/menus';
import {initData} from './data/chart-init';

import {TranslateService} from '@ngx-translate/core';
import {ChartComponent} from './components/chart/chart.component';

@Component({
  selector: 'demo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit, AfterContentInit {
  @ViewChildren('chart') allCharts!: QueryList<ChartComponent>;

  private readonly CHART_LABELS = 'isyAngularWidgetsDemo.menuItems.exampleDashboardChartLabels';

  private readonly selectedLanguage: string = 'de';

  protected readonly widgetMenuItems = widgetMenuItems;

  protected readonly widgetBackgroundColors = widgetBackgroundColors;

  chartInitData = initData;

  chartData = [barChartData, lineChartData, lineStyleChartData, stackedChartData];

  constructor(public translate: TranslateService) {}

  ngAfterContentInit(): void {
    this.getChartLabels();
  }

  ngOnInit(): void {
    this.initCharts();
    this.translate.onLangChange.subscribe(() => {
      this.getChartLabels();
    });
    this.changeLanguage(this.selectedLanguage);
  }

  initCharts(): void {
    for (let i = 0; i < initData.length; i++) {
      this.chartInitData[i].data = this.chartData[i];
    }
  }

  getChartLabels(): void {
    this.translate.get(this.CHART_LABELS).subscribe((labels: string[]) => {
      this.setupTranslatedLabels(labels);
      if (this.allCharts) this.refreshCharLabels();
    });
  }

  setupTranslatedLabels(labels: string[]): void {
    this.chartData.forEach((chart) => (chart.labels = labels));
  }

  refreshCharLabels(): void {
    this.allCharts.map((currentChart) => currentChart.chart.refresh());
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
