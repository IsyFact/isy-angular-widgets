import {InputCharDialogLeftSideComponent} from './input-char-dialog-left-side.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('InputCharDialogLeftSideComponent', () => {
  let spectator: Spectator<InputCharDialogLeftSideComponent>;
  const createComponent = createComponentFactory(InputCharDialogLeftSideComponent);

  beforeEach( () => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
