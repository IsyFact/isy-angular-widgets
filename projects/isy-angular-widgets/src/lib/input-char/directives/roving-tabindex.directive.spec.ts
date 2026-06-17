import {Component} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {RovingTabindexDirective} from './roving-tabindex.directive';

@Component({
  standalone: true,
  imports: [RovingTabindexDirective],
  template: `
    <div isyRovingTabindex [itemSelector]="'button'" [wrap]="wrap">
      <button id="a">A</button>
      <button id="b" [disabled]="disabledB">B</button>
      <button id="c">C</button>
    </div>
  `
})
class HostComponent {
  wrap = true;
  disabledB = false;
}

describe('RovingTabindexDirective', () => {
  let spectator: Spectator<HostComponent>;

  const createComponent = createComponentFactory({component: HostComponent, detectChanges: false});

  const tabindexOf = (id: string): string | null => spectator.query(`#${id}`)?.getAttribute('tabindex') ?? null;

  const button = (id: string): HTMLButtonElement => spectator.query(`#${id}`) as HTMLButtonElement;

  const pressKey = (id: string, key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {key, bubbles: true, cancelable: true});
    button(id).dispatchEvent(event);
    spectator.detectChanges();

    return event;
  };

  beforeEach(async () => {
    spectator = createComponent();
    spectator.detectChanges();
    // The directive applies the initial roving tabindex in a microtask.
    await Promise.resolve();
    spectator.detectChanges();
  });

  // F1: exactly one tab stop initially
  it('should keep only the first item tabbable initially', () => {
    expect(tabindexOf('a')).toBe('0');
    expect(tabindexOf('b')).toBe('-1');
    expect(tabindexOf('c')).toBe('-1');
  });

  // F2: ArrowDown / ArrowRight move forward and focus the next item
  it('should move the tab stop forward on ArrowDown', () => {
    button('a').focus();
    const focusSpy = spyOn(button('b'), 'focus').and.callThrough();

    pressKey('a', 'ArrowDown');

    expect(tabindexOf('a')).toBe('-1');
    expect(tabindexOf('b')).toBe('0');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should move the tab stop forward on ArrowRight', () => {
    pressKey('a', 'ArrowRight');

    expect(tabindexOf('b')).toBe('0');
  });

  // F3: ArrowUp / ArrowLeft move backward
  it('should move the tab stop backward on ArrowUp', () => {
    pressKey('a', 'ArrowRight');
    pressKey('b', 'ArrowUp');

    expect(tabindexOf('a')).toBe('0');
    expect(tabindexOf('b')).toBe('-1');
  });

  // F4: wrap-around at the ends when wrap is enabled
  it('should wrap from the last to the first item', () => {
    pressKey('a', 'ArrowRight');
    pressKey('b', 'ArrowRight');

    expect(tabindexOf('c')).toBe('0');

    pressKey('c', 'ArrowRight');

    expect(tabindexOf('a')).toBe('0');
    expect(tabindexOf('c')).toBe('-1');
  });

  // F5: clamp instead of wrap when wrap is disabled
  it('should clamp at the first item when wrap is disabled', () => {
    spectator.component.wrap = false;
    spectator.detectChanges();

    pressKey('a', 'ArrowUp');

    expect(tabindexOf('a')).toBe('0');
  });

  // F6: disabled items are skipped
  it('should skip disabled items during navigation', () => {
    spectator.component.disabledB = true;
    spectator.detectChanges();

    pressKey('a', 'ArrowRight');

    // B is disabled and therefore skipped; focus lands on C.
    expect(tabindexOf('a')).toBe('-1');
    expect(tabindexOf('c')).toBe('0');
  });

  // F7: Enter activates the current item via click()
  it('should activate the current item on Enter', () => {
    const clickSpy = spyOn(button('a'), 'click');

    pressKey('a', 'Enter');

    expect(clickSpy).toHaveBeenCalled();
  });

  // F7: Space activates the current item via click()
  it('should activate the current item on Space', () => {
    const clickSpy = spyOn(button('a'), 'click');

    pressKey('a', ' ');

    expect(clickSpy).toHaveBeenCalled();
  });

  // F8: handled keys are prevented and stop propagation
  it('should prevent default for keys it handles', () => {
    const event = pressKey('a', 'ArrowRight');

    expect(event.defaultPrevented).toBeTrue();
  });

  it('should not prevent default for keys it does not handle', () => {
    const event = pressKey('a', 'Tab');

    expect(event.defaultPrevented).toBeFalse();
  });

  // F9: focusin moves the single tab stop to the focused item
  it('should move the single tab stop to the focused element', () => {
    button('c').dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
    spectator.detectChanges();

    expect(tabindexOf('a')).toBe('-1');
    expect(tabindexOf('c')).toBe('0');
  });
});
