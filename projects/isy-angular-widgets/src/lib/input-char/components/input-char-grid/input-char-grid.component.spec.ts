import {InputCharGridComponent} from './input-char-grid.component';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

/**
 * Builds a list of synthetic characters with unique codepoints.
 * @param count The number of characters to create.
 * @returns The generated character list.
 */
function makeChars(count: number): Zeichenobjekt[] {
  return Array.from({length: count}, (_, index) => ({
    zeichen: String.fromCharCode(65 + index),
    grundzeichen: '',
    schriftzeichengruppe: Schriftzeichengruppe.LATEIN,
    name: `name-${index}`,
    codepoint: `U+${index}`
  }));
}

/**
 * Defines the position of a single cell in the mocked layout.
 * @internal
 */
interface RectDef {
  /** Left offset. */
  x: number;
  /** Top offset. */
  y: number;
  /** Width (default 40). */
  w?: number;
  /** Height (default 40). */
  h?: number;
}

describe('InputCharGridComponent', () => {
  let spectator: Spectator<InputCharGridComponent>;
  let component: InputCharGridComponent;

  const createComponent = createComponentFactory({
    component: InputCharGridComponent,
    detectChanges: false
  });

  /**
   * @returns The rendered option cell elements.
   */
  const cellEls = (): HTMLElement[] => spectator.queryAll<HTMLElement>('.character-option');

  /**
   * Mocks the bounding rect of each cell to create a deterministic layout.
   * @param rects The rect definitions keyed by cell index.
   */
  const mockLayout = (rects: Record<number, RectDef>): void => {
    cellEls().forEach((element, index) => {
      const rect = rects[index];

      if (!rect) {
        return;
      }

      spyOn(element, 'getBoundingClientRect').and.returnValue(new DOMRect(rect.x, rect.y, rect.w ?? 40, rect.h ?? 40));
    });
  };

  /**
   * Mocks the scroll geometry of the listbox container.
   * @param clientHeight The visible viewport height.
   * @param scrollHeight The total scrollable height.
   */
  const mockScroll = (clientHeight: number, scrollHeight: number): void => {
    const listbox = spectator.query('.character-listbox') as HTMLElement;

    Object.defineProperty(listbox, 'clientHeight', {value: clientHeight, configurable: true});
    Object.defineProperty(listbox, 'scrollHeight', {value: scrollHeight, configurable: true});
  };

  /**
   * Dispatches a navigation key to the component.
   * @param key The key value.
   * @param index The index of the focused cell.
   * @returns The dispatched keyboard event (with spied default handlers).
   */
  const press = (key: string, index: number): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {key, cancelable: true});

    spyOn(event, 'preventDefault').and.callThrough();
    spyOn(event, 'stopPropagation').and.callThrough();

    component.onKeydown(event, index);
    spectator.detectChanges();

    return event;
  };

  /**
   * Renders the component with the given characters and selection.
   * @param characters The characters to display.
   * @param selected The initially selected character.
   */
  const setup = (characters: Zeichenobjekt[], selected?: Zeichenobjekt): void => {
    spectator = createComponent({props: {characters, selected, ariaLabel: 'Auswahl'}});
    component = spectator.component;
    spectator.detectChanges();
  };

  it('should create', () => {
    setup(makeChars(4));

    expect(component).toBeTruthy();
  });

  describe('ARIA / roving tabindex (FR-6)', () => {
    it('should render a listbox with options and an aria-label', () => {
      setup(makeChars(3));

      const listbox = spectator.query('.character-listbox') as HTMLElement;

      expect(listbox.getAttribute('role')).toBe('listbox');
      expect(listbox.getAttribute('aria-label')).toBe('Auswahl');
      expect(spectator.queryAll('[role="option"]').length).toBe(3);
    });

    it('should label each option with name and codepoint', () => {
      const chars = makeChars(1);
      setup(chars);

      expect(cellEls()[0].getAttribute('aria-label')).toBe(`${chars[0].name} (${chars[0].codepoint})`);
    });

    it('should mark the selected option and expose aria-selected', () => {
      const chars = makeChars(3);
      setup(chars, chars[1]);

      const cells = cellEls();

      expect(cells[1].getAttribute('aria-selected')).toBe('true');
      expect(cells[0].getAttribute('aria-selected')).toBe('false');
      expect(cells[1]).toHaveClass('selected');
    });

    it('should keep exactly one tabbable cell (the selected one)', () => {
      const chars = makeChars(4);
      setup(chars, chars[2]);

      const tabbable = cellEls().filter((cell) => cell.getAttribute('tabindex') === '0');

      expect(tabbable.length).toBe(1);
      expect(tabbable[0]).toBe(cellEls()[2]);
    });

    it('should default the tabbable cell to the first one without a selection', () => {
      setup(makeChars(4));

      expect(component.activeIndex).toBe(0);
      expect(cellEls()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should reset the roving index and discard an invalid selection on filter change (FR-6.4)', () => {
      const first = makeChars(4);
      setup(first, first[2]);

      const next = makeChars(2);
      spectator.setInput('characters', next);
      spectator.detectChanges();

      expect(component.activeIndex).toBe(0);
    });

    it('should make the container non-tabbable when empty (edge case 1)', () => {
      setup([]);

      const listbox = spectator.query('.character-listbox') as HTMLElement;

      expect(listbox.getAttribute('tabindex')).toBe('-1');
      expect(cellEls().length).toBe(0);
    });
  });

  describe('mouse parity (FR-5)', () => {
    it('should select on click without inserting (T9)', () => {
      const chars = makeChars(3);
      setup(chars);

      const selectedChange = spyOn(component.selectedChange, 'emit');
      const insert = spyOn(component.insert, 'emit');

      cellEls()[1].click();
      spectator.detectChanges();

      expect(selectedChange).toHaveBeenCalledWith(chars[1]);
      expect(insert).not.toHaveBeenCalled();
      expect(component.activeIndex).toBe(1);
    });

    it('should ignore clicks on disabled cells (FR-5.3)', () => {
      const chars = makeChars(3);
      spectator = createComponent({props: {characters: chars, isDisabled: (c) => c === chars[1]}});
      component = spectator.component;
      spectator.detectChanges();

      const selectedChange = spyOn(component.selectedChange, 'emit');

      cellEls()[1].click();

      expect(selectedChange).not.toHaveBeenCalled();
    });
  });

  describe('Enter / Space (FR-4)', () => {
    it('should emit insert on Enter (T8)', () => {
      const chars = makeChars(3);
      setup(chars, chars[0]);

      const insert = spyOn(component.insert, 'emit');

      press('Enter', 0);

      expect(insert).toHaveBeenCalled();
    });

    it('should only select on Space, never insert (FR-4.2)', () => {
      const chars = makeChars(3);
      setup(chars);

      const insert = spyOn(component.insert, 'emit');
      const selectedChange = spyOn(component.selectedChange, 'emit');

      const event = press(' ', 1);

      expect(insert).not.toHaveBeenCalled();
      expect(selectedChange).toHaveBeenCalledWith(chars[1]);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('arrow navigation (FR-2)', () => {
    /**
     * Sets up a 3x3 grid (last row centered with a gap) and returns the characters.
     * Columns centerX: 20, 60, 100. Rows top: 0, 40, 80.
     * @returns The grid characters.
     */
    const setupGrid = (): Zeichenobjekt[] => {
      const chars = makeChars(8);
      setup(chars, chars[4]);
      mockLayout({
        0: {x: 0, y: 0},
        1: {x: 40, y: 0},
        2: {x: 80, y: 0},
        3: {x: 0, y: 40},
        4: {x: 40, y: 40},
        5: {x: 80, y: 40},
        // centered partial last row: centerX 50 and 90
        6: {x: 30, y: 80},
        7: {x: 70, y: 80}
      });

      return chars;
    };

    it('should move right and left within a row', () => {
      const chars = setupGrid();
      const selectedChange = spyOn(component.selectedChange, 'emit');

      press('ArrowRight', 4);
      expect(component.selected).toBe(chars[5]);

      press('ArrowLeft', 5);
      expect(component.selected).toBe(chars[4]);

      expect(selectedChange).toHaveBeenCalledWith(chars[5]);
      expect(selectedChange).toHaveBeenCalledWith(chars[4]);
    });

    it('should not wrap at the row edge (FR-2.2)', () => {
      const chars = setupGrid();

      press('ArrowRight', 2);

      expect(component.selected).toBe(chars[4]);
      expect(component.activeIndex).toBe(4);
    });

    it('should move down to the visually adjacent cell (T2)', () => {
      const chars = setupGrid();

      press('ArrowDown', 1);

      expect(component.selected).toBe(chars[4]);
    });

    it('should clamp at the last row (T3)', () => {
      const chars = setupGrid();

      press('ArrowDown', 6);

      expect(component.selected).toBe(chars[4]);
      expect(component.activeIndex).toBe(4);
    });

    it('should pick the horizontally nearest cell over a gap (T4)', () => {
      const chars = setupGrid();

      // from index 4 (centerX 60) down to centered row -> nearest is index 6 (centerX 50)
      press('ArrowDown', 4);

      expect(component.selected).toBe(chars[6]);
    });

    it('should prevent default and stop propagation on arrow keys (FR-2.6)', () => {
      setupGrid();

      const event = press('ArrowDown', 1);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should not handle Tab (focus trap must still work)', () => {
      setupGrid();

      const event = new KeyboardEvent('keydown', {key: 'Tab', cancelable: true});
      spyOn(event, 'preventDefault').and.callThrough();

      component.onKeydown(event, 4);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should focus and scroll the target cell into view (FR-2.5)', () => {
      setupGrid();
      const target = cellEls()[5];
      const focusSpy = spyOn(target, 'focus');
      const scrollSpy = spyOn(target, 'scrollIntoView');

      press('ArrowRight', 4);

      expect(focusSpy).toHaveBeenCalled();
      expect(scrollSpy).toHaveBeenCalledWith({block: 'nearest', inline: 'nearest'});
    });

    it('should keep focus on a single-row grid for ArrowUp/Down (edge case 4)', () => {
      const chars = makeChars(3);
      setup(chars, chars[1]);
      mockLayout({0: {x: 0, y: 0}, 1: {x: 40, y: 0}, 2: {x: 80, y: 0}});

      press('ArrowDown', 1);
      expect(component.selected).toBe(chars[1]);

      press('ArrowUp', 1);
      expect(component.selected).toBe(chars[1]);
    });
  });

  describe('disabled skipping (FR-2.4)', () => {
    it('should skip a disabled cell in the movement direction (T5)', () => {
      const chars = makeChars(3);
      spectator = createComponent({props: {characters: chars, selected: chars[0], isDisabled: (c) => c === chars[1]}});
      component = spectator.component;
      spectator.detectChanges();
      mockLayout({0: {x: 0, y: 0}, 1: {x: 40, y: 0}, 2: {x: 80, y: 0}});

      press('ArrowRight', 0);

      expect(component.selected).toBe(chars[2]);
    });

    it('should stay put when the adjacent row is fully disabled (edge case 5)', () => {
      const chars = makeChars(4);
      spectator = createComponent({
        props: {characters: chars, selected: chars[0], isDisabled: (c) => c === chars[2] || c === chars[3]}
      });
      component = spectator.component;
      spectator.detectChanges();
      mockLayout({0: {x: 0, y: 0}, 1: {x: 40, y: 0}, 2: {x: 0, y: 40}, 3: {x: 40, y: 40}});

      press('ArrowDown', 0);

      expect(component.selected).toBe(chars[0]);
    });
  });

  describe('focusActiveCell', () => {
    it('should focus the active cell', () => {
      const chars = makeChars(3);
      setup(chars, chars[1]);

      const focusSpy = spyOn(cellEls()[1], 'focus');

      component.focusActiveCell();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should do nothing when there is no active cell', () => {
      setup([]);

      expect(() => component.focusActiveCell()).not.toThrow();
    });
  });

  describe('escape', () => {
    it('should emit the keyboard event on Escape without suppressing it', () => {
      const chars = makeChars(3);
      setup(chars, chars[0]);

      const escape = spyOn(component.escape, 'emit');
      const event = press('Escape', 0);

      expect(escape).toHaveBeenCalledWith(event);
      // The grid leaves suppression to the dialog (FR-7.6 / FR-7.8).
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('jump keys (FR-3)', () => {
    /**
     * Builds a 2-column, 4-row grid (8 cells).
     * @returns The grid characters.
     */
    const setupColumns = (): Zeichenobjekt[] => {
      const chars = makeChars(8);
      setup(chars, chars[0]);
      mockLayout({
        0: {x: 0, y: 0},
        1: {x: 40, y: 0},
        2: {x: 0, y: 40},
        3: {x: 40, y: 40},
        4: {x: 0, y: 80},
        5: {x: 40, y: 80},
        6: {x: 0, y: 120},
        7: {x: 40, y: 120}
      });

      return chars;
    };

    it('should jump to the first and last valid cell with Home/End (T6)', () => {
      const chars = setupColumns();

      press('End', 0);
      expect(component.selected).toBe(chars[7]);

      press('Home', 7);
      expect(component.selected).toBe(chars[0]);
    });

    it('should page down by one viewport page when scrollable (T7)', () => {
      const chars = setupColumns();
      mockScroll(80, 160); // 2 rows visible, scrollable

      press('PageDown', 0);

      // from row 0, +2 rows -> row 2, same column -> index 4
      expect(component.selected).toBe(chars[4]);
    });

    it('should jump to the last row on PageDown when not scrollable (FR-3.2)', () => {
      const chars = setupColumns();
      mockScroll(160, 160); // everything visible

      press('PageDown', 0);

      expect(component.selected).toBe(chars[6]);
    });

    it('should jump to the first row on PageUp when not scrollable', () => {
      const chars = setupColumns();
      mockScroll(160, 160);

      press('PageUp', 6);

      expect(component.selected).toBe(chars[0]);
    });
  });
});
