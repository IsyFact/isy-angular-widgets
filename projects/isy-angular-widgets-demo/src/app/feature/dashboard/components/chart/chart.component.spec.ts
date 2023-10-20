import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartComponent} from './chart.component';
import {ChartModule} from 'primeng/chart';
import {responsiveOptions} from '../../data/chart-configs';
import {barChartData} from '../../data/chart-data';

describe('Integration Tests: ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  const type = 'bar';
  const data = barChartData;
  const options = responsiveOptions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [ChartModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.type = type;
    component.data = data;
    component.options = options;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have be correctly initialized', () => {
    expect(component.chart.type).toEqual(type);
    expect(component.chart.data).toEqual(data);
    expect(component.chart.options).toEqual(options);
  });

  it('should be responsive', () => {
    expect(component.chart.responsive).toBeTrue();
  });
});
