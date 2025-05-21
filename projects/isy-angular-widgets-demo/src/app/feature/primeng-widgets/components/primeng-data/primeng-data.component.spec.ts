import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PrimengDataComponent} from './primeng-data.component';

describe('Unit Tests: PrimengDataComponent', () => {
  let component: PrimengDataComponent;
  let spectator: Spectator<PrimengDataComponent>;
  const createComponent = createComponentFactory({
    component: PrimengDataComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
