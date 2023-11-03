import {DashboardComponent} from './dashboard.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {DashboardModule} from './dashboard.module';

describe('Integration Tests: DashboardComponent', () => {
  const GERMAN_LANGUAGE = 'de';
  const ENGLISH_LANGUAGE = 'en';
  const chartRows = 4;

  let spectator: Spectator<DashboardComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardComponent,
    imports: [DashboardModule, TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(()=> spectator = createdComponent());

  /**
   * Expects that the chart was initialized
   */
  function expectChartDataBeInit(): void {
    for (let i = 0; i < spectator.component.chartInitData.length; i++) {
      expect(spectator.component.chartInitData[i].data).toEqual(spectator.component.chartData[i]);
    }
  }

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('with available charts', () => {
    it('should init char data correctly', () => {
      spectator.component.initCharts();
      expectChartDataBeInit();
    });

    it(`should have ${chartRows} chart data rows`, () => {
      expect(spectator.component.chartData.length).toEqual(chartRows);
    });
  });

  describe('with translations functionality', () => {
    it('should have the german language as default language', () => {
      expect(spectator.component.translate.langs.length).toEqual(1);
      expect(spectator.component.translate.langs[0]).toEqual(GERMAN_LANGUAGE);
      expect(spectator.component.translate.currentLang).toEqual(GERMAN_LANGUAGE);
    });

    it('should change the current language', () => {
      expect(spectator.component.translate.langs.length).toEqual(1);
      spectator.component.changeLanguage(ENGLISH_LANGUAGE);
      expect(spectator.component.translate.langs.length).toEqual(2);
      expect(spectator.component.translate.currentLang).toEqual(ENGLISH_LANGUAGE);
    });
  });
});
