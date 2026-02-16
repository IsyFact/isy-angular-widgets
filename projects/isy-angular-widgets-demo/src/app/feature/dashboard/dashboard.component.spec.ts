import {DashboardComponent} from './dashboard.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: DashboardComponent', () => {
  const GERMAN_LANGUAGE = 'de';
  const ENGLISH_LANGUAGE = 'en';
  const chartRows = 4;

  let component: DashboardComponent;
  let spectator: Spectator<DashboardComponent>;
  const createComponent = createComponentFactory({
    component: DashboardComponent,
    imports: [DashboardComponent, TranslateModule.forRoot()],
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
    spectator = createComponent();
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
    it('should request german as initial language', () => {
      const useSpy = spyOn(component.translate, 'use').and.callThrough();
      component.ngOnInit?.();
      expect(useSpy).toHaveBeenCalledWith(GERMAN_LANGUAGE);
    });

    it('should change the current language', () => {
      const useSpy = spyOn(component.translate, 'use').and.callThrough();
      component.changeLanguage(ENGLISH_LANGUAGE);
      expect(useSpy).toHaveBeenCalledWith(ENGLISH_LANGUAGE);
    });
  });
});
