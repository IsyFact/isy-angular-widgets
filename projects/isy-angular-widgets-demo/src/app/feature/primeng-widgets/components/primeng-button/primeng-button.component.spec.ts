import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PrimengButtonComponent} from './primeng-button.component';

describe('Unit Tests: PrimengButtonComponent', () => {
  let component: PrimengButtonComponent;
  let spectator: Spectator<PrimengButtonComponent>;
  const createComponent = createComponentFactory({
    component: PrimengButtonComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
