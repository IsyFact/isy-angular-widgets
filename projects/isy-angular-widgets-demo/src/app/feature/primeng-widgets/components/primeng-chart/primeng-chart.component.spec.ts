import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PrimengChartComponent} from './primeng-chart.component';

describe('Unit Tests: PrimengChartComponent', () => {
  let component: PrimengChartComponent;
  let spectator: Spectator<PrimengChartComponent>;
  const createComponent = createComponentFactory({
    component: PrimengChartComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
