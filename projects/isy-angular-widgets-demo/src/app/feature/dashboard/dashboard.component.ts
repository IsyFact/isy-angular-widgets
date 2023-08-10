import {AfterContentInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {barChartData, lineStyleChartData, lineChartData, stackedChartData} from './data/chart-data';
import {widgetBackgroundColors} from './data/menu-colors';
import {widgetMenuItems} from './data/menus';
import {stackedOptions} from './data/chart-configs';
import {TranslateService} from '@ngx-translate/core';
import {ChartComponent} from './components/chart/chart.component';

@Component({
  selector: 'demo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {
  @ViewChildren('chart') allCharts!: QueryList<ChartComponent>;

  private CHART_LABELS = 'isyAngularWidgetsDemo.menuItems.exampleDashboardChartLabels';
  private selectedLanguage: string = 'de';

  protected readonly widgetMenuItems = widgetMenuItems;
  protected readonly widgetBackgroundColors = widgetBackgroundColors;
  protected readonly stackedOptions = stackedOptions;
  chartData = [
    barChartData,
    lineChartData,
    lineStyleChartData,
    stackedChartData
  ];

  constructor(public translate: TranslateService) {
  }

  ngAfterContentInit(): void {
    this.getChartLabels();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.getChartLabels();
    });
    this.changeLanguage(this.selectedLanguage);
  }

  getChartLabels(): void {
    this.translate.get(this.CHART_LABELS).subscribe((labels: string[]) => {
      this.setupTranslatedLabels(labels);
      if (this.allCharts) this.refreshCharLabels();
    });
  }

  setupTranslatedLabels(labels: string[]): void {
    this.chartData.map(chart => chart.labels = labels);
  }

  refreshCharLabels(): void {
    this.allCharts.map(currentChart => currentChart.chart.refresh());
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
