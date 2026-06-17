import {Component} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {RovingTabindexDirective} from './roving-tabindex.directive';

@Component({
  standalone: true,
  imports: [RovingTabindexDirective],
  template: `
    <div isyRovingTabindex>
      <button id="a">A</button>
      <button id="b">B</button>
      <button id="c">C</button>
    </div>
  `
})
class HostComponent {}

describe('RovingTabindexDirective', () => {
  let spectator: Spectator<HostComponent>;

  const createComponent = createComponentFactory({component: HostComponent, detectChanges: false});

  const tabindexOf = (id: string): string | null => spectator.query(`#${id}`)?.getAttribute('tabindex') ?? null;

  beforeEach(() => {
    // Ensure the focusable detection (which relies on getClientRects) sees laid-out elements.
    spyOn(HTMLElement.prototype, 'getClientRects').and.returnValue([
      new DOMRect(0, 0, 10, 10)
    ] as unknown as DOMRectList);

    spectator = createComponent();
    spectator.detectChanges();
  });

  it('should keep only the first focusable tabbable initially', async () => {
    await Promise.resolve();
    spectator.detectChanges();

    expect(tabindexOf('a')).toBe('0');
    expect(tabindexOf('b')).toBe('-1');
    expect(tabindexOf('c')).toBe('-1');
  });

  it('should move the single tab stop to the focused element', async () => {
    await Promise.resolve();

    const buttonB = spectator.query('#b') as HTMLButtonElement;
    buttonB.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
    spectator.detectChanges();

    expect(tabindexOf('a')).toBe('-1');
    expect(tabindexOf('b')).toBe('0');
    expect(tabindexOf('c')).toBe('-1');
  });
});
