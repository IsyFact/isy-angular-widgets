import {ChartComponent} from './chart.component';
import {ChartModule} from 'primeng/chart';
import {responsiveOptions} from '../../data/chart-configs';
import {barChartData} from '../../data/chart-data';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: ChartComponent', () => {
  let component: ChartComponent;
  let spectator: Spectator<ChartComponent>;
  const createComponent = createComponentFactory({
    component: ChartComponent,
    imports: [ChartModule]
  });

  const props = {
    type: 'bar' as 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter',
    data: barChartData,
    options: responsiveOptions
  };

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have be correctly initialized', () => {
    expect(component.chart.type).toEqual(props.type);
    expect(component.chart.data).toEqual(props.data);
    expect(component.chart.options).toEqual(props.options);
  });

  it('should be responsive', () => {
    expect(component.chart.responsive).toBeTrue();
  });
});
