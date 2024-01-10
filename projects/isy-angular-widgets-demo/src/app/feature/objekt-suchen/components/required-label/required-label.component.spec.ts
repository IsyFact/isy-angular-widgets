import {RequiredLabelComponent} from './required-label.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Unit Tests: RequiredLabelComponent', () => {
  const labelText = '*';
  const className = 'required-field';
  let spectator: Spectator<RequiredLabelComponent>;
  const createComponent = createComponentFactory(RequiredLabelComponent);

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`label should have the character '${labelText}' as inner text`, () => {
    const label = spectator.query(`.${className}`) as HTMLElement;
    expect(label.innerText).toEqual(labelText);
  });

  it(`label class should be '.${className}'`, () => {
    const label = spectator.query(`.${className}`) as HTMLElement;
    expect(label.className).toContain(className);
  });
});
