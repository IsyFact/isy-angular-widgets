import {ChartComponent} from './chart.component';
import {ChartModule} from 'primeng/chart';
import {responsiveOptions} from '../../data/chart-configs';
import {barChartData} from '../../data/chart-data';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: ChartComponent', () => {
  let spectator: Spectator<ChartComponent>;
  const createdComponent = createComponentFactory({
    component: ChartComponent,
    imports: [ChartModule]
  });

  const type = 'bar';
  const data = barChartData;
  const options = responsiveOptions;

  beforeEach(()=> {
    spectator = createdComponent();
    spectator.component.type = type;
    spectator.component.data = data;
    spectator.component.options = options;
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have be correctly initialized', () => {
    expect(spectator.component.chart.type).toEqual(type);
    expect(spectator.component.chart.data).toEqual(data);
    expect(spectator.component.chart.options).toEqual(options);
  });

  it('should be responsive', () => {
    expect(spectator.component.chart.responsive).toBeTrue();
  });
});
