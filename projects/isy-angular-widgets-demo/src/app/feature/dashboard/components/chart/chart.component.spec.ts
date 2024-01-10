import {ChartComponent} from './chart.component';
import {ChartModule} from 'primeng/chart';
import {responsiveOptions} from '../../data/chart-configs';
import {barChartData} from '../../data/chart-data';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: ChartComponent', () => {
  let component: ChartComponent;
  let spectator: Spectator<ChartComponent>;
<<<<<<< HEAD
  const createdComponent = createComponentFactory({
=======
  const createComponent = createComponentFactory({
>>>>>>> origin
    component: ChartComponent,
    imports: [ChartModule]
  });

  const type = 'bar';
  const data = barChartData;
  const options = responsiveOptions;

  beforeEach(() => {
<<<<<<< HEAD
    spectator = createdComponent();
=======
    spectator = createComponent();
>>>>>>> origin
    component = spectator.component;

    component.type = type;
    component.data = data;
    component.options = options;
    spectator.fixture.detectChanges();
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
