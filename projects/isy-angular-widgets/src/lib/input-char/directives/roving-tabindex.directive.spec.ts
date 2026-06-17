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

// Grid-mode host: 3×3 layout (row0: r0c0, r0c1, r0c2 | row1: r1c0, r1c1, r1c2 | row2: r2c0)
@Component({
  standalone: true,
  imports: [RovingTabindexDirective],
  template: `
    <div isyRovingTabindex [itemSelector]="'button'" [navigation]="'grid'" [wrap]="wrap">
      <button id="r0c0">0,0</button>
      <button id="r0c1">0,1</button>
      <button id="r0c2">0,2</button>
      <button id="r1c0">1,0</button>
      <button id="r1c1">1,1</button>
      <button id="r1c2">1,2</button>
      <button id="r2c0">2,0</button>
    </div>
  `
})
class GridHostComponent {
  wrap = true;
}

describe('RovingTabindexDirective (navigation: grid)', () => {
  let spectator: Spectator<GridHostComponent>;

  const createComponent = createComponentFactory({component: GridHostComponent, detectChanges: false});

  const tabindexOf = (id: string): string | null => spectator.query(`#${id}`)?.getAttribute('tabindex') ?? null;

  const btn = (id: string): HTMLButtonElement => spectator.query(`#${id}`) as HTMLButtonElement;

  // Mock a 3×3 layout: cells 50×44, cell size 50 wide, 44 high.
  // Row 0: y=0,   x=0/50/100
  // Row 1: y=44,  x=0/50/100
  // Row 2: y=88,  x=0
  const CELL_W = 50;
  const CELL_H = 44;

  const mockRects: Record<string, DOMRect> = {
    r0c0: new DOMRect(0, 0, CELL_W, CELL_H),
    r0c1: new DOMRect(CELL_W, 0, CELL_W, CELL_H),
    r0c2: new DOMRect(CELL_W * 2, 0, CELL_W, CELL_H),
    r1c0: new DOMRect(0, CELL_H, CELL_W, CELL_H),
    r1c1: new DOMRect(CELL_W, CELL_H, CELL_W, CELL_H),
    r1c2: new DOMRect(CELL_W * 2, CELL_H, CELL_W, CELL_H),
    r2c0: new DOMRect(0, CELL_H * 2, CELL_W, CELL_H)
  };

  const pressKey = (id: string, key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {key, bubbles: true, cancelable: true});
    btn(id).dispatchEvent(event);
    spectator.detectChanges();

    return event;
  };

  beforeEach(async () => {
    spectator = createComponent();
    spectator.detectChanges();
    await Promise.resolve();
    spectator.detectChanges();

    // Give each button its mock bounding rect.
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.callFake(function (this: HTMLElement) {
      return mockRects[this.id] ?? new DOMRect(0, 0, 0, 0);
    });
  });

  // G1: ArrowDown moves to the item visually below (same column)
  it('should move to the item below on ArrowDown', () => {
    btn('r0c1').focus();
    pressKey('r0c1', 'ArrowDown');

    expect(tabindexOf('r1c1')).toBe('0');
  });

  // G2: ArrowUp moves to the item visually above (same column)
  it('should move to the item above on ArrowUp', () => {
    btn('r1c1').focus();
    pressKey('r1c1', 'ArrowUp');

    expect(tabindexOf('r0c1')).toBe('0');
  });

  // G3: ArrowRight moves to the next item in the same row
  it('should move right within the same row on ArrowRight', () => {
    btn('r0c0').focus();
    pressKey('r0c0', 'ArrowRight');

    expect(tabindexOf('r0c1')).toBe('0');
  });

  // G4: ArrowLeft moves to the previous item in the same row
  it('should move left within the same row on ArrowLeft', () => {
    btn('r0c2').focus();
    pressKey('r0c2', 'ArrowLeft');

    expect(tabindexOf('r0c1')).toBe('0');
  });

  // G5: ArrowRight at row end steps to the first item of the next row
  it('should step to the first item of the next row when ArrowRight reaches row end', () => {
    btn('r0c2').focus();
    pressKey('r0c2', 'ArrowRight');

    expect(tabindexOf('r1c0')).toBe('0');
  });

  // G6: ArrowLeft at row start steps to the last item of the previous row
  it('should step to the last item of the previous row when ArrowLeft reaches row start', () => {
    btn('r1c0').focus();
    pressKey('r1c0', 'ArrowLeft');

    expect(tabindexOf('r0c2')).toBe('0');
  });

  // G7: ArrowDown on last row stays (no wrap vertically)
  it('should not move when ArrowDown is pressed on the last row', () => {
    btn('r2c0').focus();
    pressKey('r2c0', 'ArrowDown');

    expect(tabindexOf('r2c0')).toBe('0');
  });

  // G8: ArrowDown picks the nearest column in the target row
  it('should pick the nearest column in the target row on ArrowDown', () => {
    // r0c2 is at x=100..150; r1c2 is the closest in row1 (x=100..150)
    btn('r0c2').focus();
    pressKey('r0c2', 'ArrowDown');

    expect(tabindexOf('r1c2')).toBe('0');
  });

  // G9: handled keys are prevented in grid mode
  it('should prevent default for arrow keys in grid mode', () => {
    btn('r0c0').focus();
    const event = pressKey('r0c0', 'ArrowDown');

    expect(event.defaultPrevented).toBeTrue();
  });
});
