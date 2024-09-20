import {createComponentFactory, Spectator} from '@ngneat/spectator';

import {PrimengFileComponent} from './primeng-file.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengFileComponent', () => {
  let component: PrimengFileComponent;
  let spectator: Spectator<PrimengFileComponent>;
  const createComponent = createComponentFactory({
    component: PrimengFileComponent,
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
