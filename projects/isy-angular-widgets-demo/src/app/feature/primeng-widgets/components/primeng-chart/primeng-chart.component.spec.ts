import {createComponentFactory, Spectator} from '@ngneat/spectator';

import {PrimengChartComponent} from './primeng-chart.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengChartComponent', () => {
  let component: PrimengChartComponent;
  let spectator: Spectator<PrimengChartComponent>;
  const createComponent = createComponentFactory({
    component: PrimengChartComponent,
    imports: [PrimengWidgetsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
