import {createComponentFactory, Spectator} from '@ngneat/spectator';

import {PrimengWidgetsModule} from '../../primeng-widgets.module';
import {PrimengButtonComponent} from './primeng-button.component';

describe('Unit Tests: PrimengButtonComponent', () => {
  let component: PrimengButtonComponent;
  let spectator: Spectator<PrimengButtonComponent>;
  const createComponent = createComponentFactory({
    component: PrimengButtonComponent,
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
