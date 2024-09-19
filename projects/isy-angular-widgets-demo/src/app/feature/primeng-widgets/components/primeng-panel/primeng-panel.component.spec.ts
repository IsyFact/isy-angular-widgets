import {createComponentFactory, Spectator} from '@ngneat/spectator';

import {PrimengPanelComponent} from './primeng-panel.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengPanelComponent', () => {
  let component: PrimengPanelComponent;
  let spectator: Spectator<PrimengPanelComponent>;
  const createComponent = createComponentFactory({
    component: PrimengPanelComponent,
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
