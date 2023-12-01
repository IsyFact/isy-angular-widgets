import {DashboardComponent} from './dashboard.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {DashboardModule} from './dashboard.module';

describe('Integration Tests: DashboardComponent', () => {
  const GERMAN_LANGUAGE = 'de';
  const ENGLISH_LANGUAGE = 'en';
  const chartRows = 4;

  let component: DashboardComponent;
  let spectator: Spectator<DashboardComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardComponent,
    imports: [DashboardModule, TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  /**
   * Expects that the chart was initialized
   */
  function expectChartDataBeInit(): void {
    for (let i = 0; i < component.chartInitData.length; i++) {
      expect(component.chartInitData[i].data).toEqual(component.chartData[i]);
    }
  }

  beforeEach(() => {
    spectator = createdComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with available charts', () => {
    it('should init char data correctly', () => {
      component.initCharts();
      expectChartDataBeInit();
    });

    it(`should have ${chartRows} chart data rows`, () => {
      expect(component.chartData.length).toEqual(chartRows);
    });
  });

  describe('with translations functionality', () => {
    it('should have the german language as default language', () => {
      expect(component.translate.langs.length).toEqual(1);
      expect(component.translate.langs[0]).toEqual(GERMAN_LANGUAGE);
      expect(component.translate.currentLang).toEqual(GERMAN_LANGUAGE);
    });

    it('should change the current language', () => {
      expect(component.translate.langs.length).toEqual(1);
      component.changeLanguage(ENGLISH_LANGUAGE);
      expect(component.translate.langs.length).toEqual(2);
      expect(component.translate.currentLang).toEqual(ENGLISH_LANGUAGE);
    });
  });
});
