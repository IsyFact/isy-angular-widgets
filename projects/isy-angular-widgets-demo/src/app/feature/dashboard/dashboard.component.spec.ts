import {ComponentFixture, TestBed} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import {
  DashboardLinksnavigationComponent
} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {
  DashboardInformationsbereichComponent
} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';
import {DashboardWidgetComponent} from './components/dashboard-widget/dashboard-widget.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CardModule} from 'primeng/card';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ChartModule} from 'primeng/chart';
import {ChartComponent} from './components/chart/chart.component';

describe('Integration Tests: DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const GERMAN_LANGUAGE = 'de';
  const ENGLISH_LANGUAGE = 'en';
  const chartRows = 4;

  /**
   * Expects that the chart was initialized
   */
  function expectChartDataBeInit(): void {
    for (let i = 0; i < component.chartInitData.length; i++) {
      expect(component.chartInitData[i].data).toEqual(component.chartData[i]);
    }
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        DashboardLinksnavigationComponent,
        DashboardInformationsbereichComponent,
        DashboardWidgetComponent,
        ChartComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        CardModule,
        PanelMenuModule,
        ChartModule
      ],
      providers: [
        TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with available charts', ()=> {
    it('should init char data correctly', () => {
      component.initCharts();
      expectChartDataBeInit();
    });

    it(`should have ${chartRows} chart data rows`, () => {
      expect(component.chartData.length).toEqual(chartRows);
    });
  });

  describe('with translations functionality', ()=> {
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
