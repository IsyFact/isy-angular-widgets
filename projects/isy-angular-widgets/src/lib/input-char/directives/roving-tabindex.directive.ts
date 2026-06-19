import {AfterViewInit, Directive, ElementRef, HostListener, inject, input, OnDestroy, output} from '@angular/core';

const DEFAULT_ITEM_SELECTOR = 'p-togglebutton, p-accordion-header, [role="button"], [role="radio"]';
const NOT_FOUND = -1;
const STEP_PREVIOUS = -1;
const STEP_NEXT = 1;
const NO_STEP = 0;
const LAYOUT_DIVISOR = 2;

/**
 * Orientation of the roving navigation.
 * @internal
 */
type RovingOrientation = 'horizontal' | 'vertical' | 'both';

/**
 * Navigation style for arrow-key handling.
 *
 * - `linear`: arrow keys step forward/backward through the flat item list (1D).
 * - `grid`: arrow keys navigate geometrically across a measured 2D layout, so
 *   ArrowDown/ArrowUp move to the item visually below/above the current one.
 * @internal
 */
type RovingNavigation = 'linear' | 'grid';

/**
 * A single item in the geometric layout map used by {@link RovingNavigation} `'grid'`.
 * @internal
 */
interface LayoutCell {
  /** The DOM element. */
  element: HTMLElement;
  /** The horizontal center of the element in viewport coordinates. */
  centerX: number;
}

/**
 * A visual row in the geometric layout map.
 * @internal
 */
interface LayoutRow {
  /** The top offset of the row in viewport coordinates. */
  top: number;
  /** The cells of the row, ordered left to right. */
  cells: LayoutCell[];
}

/**
 * Turns its host element into a single keyboard tab stop with arrow-key navigation
 * ("roving tabindex").
 *
 * Exactly one matched item is tabbable (`tabindex="0"`), all others are `tabindex="-1"`,
 * so the whole panel is entered with a single Tab. The directive owns the arrow-key
 * navigation itself instead of relying on the embedded widgets: PrimeNG's `p-selectButton`
 * navigates with Tab (not arrows) and the accordion ships its own conflicting `keydown`
 * handler. To reliably override those, the keyboard handler runs in the capture phase and
 * stops propagation for the keys it handles.
 *
 * Activation (`Enter`/`Space`) is delegated to a synthetic `click()` so it keeps working
 * even where PrimeNG's own key activation is broken in this version.
 *
 * When {@link navigation} is `'grid'`, arrow keys navigate geometrically (measured bounding
 * rects), so ArrowDown/ArrowUp move to the item visually below/above the current one,
 * and ArrowLeft/ArrowRight move within the same visual row before stepping to an adjacent row.
 * @internal
 */
@Directive({
  selector: '[isyRovingTabindex]',
  standalone: true
})
export class RovingTabindexDirective implements AfterViewInit, OnDestroy {
  /**
   * CSS selector identifying the navigable items within the host.
   */
  readonly itemSelector = input<string>(DEFAULT_ITEM_SELECTOR);

  /**
   * Which arrow keys move the focus.
   */
  readonly orientation = input<RovingOrientation>('both');

  /**
   * Whether navigation wraps around at the ends.
   */
  readonly wrap = input<boolean>(true);

  /**
   * Navigation style: `'linear'` steps through the flat item list; `'grid'` navigates
   * geometrically so that ArrowDown/ArrowUp move to the item visually below/above.
   */
  readonly navigation = input<RovingNavigation>('linear');

  /**
   * Emits the activated item element when it is activated via keyboard (`Enter`/`Space`).
   * Lets the host react to a keyboard activation, e.g. moving focus elsewhere.
   */
  readonly itemActivate = output<HTMLElement>();

  /**
   * Emits the originating keyboard event when `Escape` is pressed within the container.
   *
   * Like the grid's `escape` output, suppression is left to the host: the directive does not
   * know whether a meaningful focus target exists, so it neither calls `preventDefault()` nor
   * stops propagation. The host listens synchronously and, only if it moves focus, suppresses
   * the event to keep the dialog open.
   */
  readonly escape = output<KeyboardEvent>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private observer?: MutationObserver;

  private readonly captureKeydown = (event: KeyboardEvent): void => this.handleKeydown(event);

  /**
   * Initializes the roving tabindex, installs the capture-phase key handler and observes
   * DOM changes (e.g. an accordion section expanding) to keep a single tab stop.
   * @internal
   */
  ngAfterViewInit(): void {
    this.host.nativeElement.addEventListener('keydown', this.captureKeydown, true);

    queueMicrotask(() => this.refresh());

    this.observer = new MutationObserver(() => this.refresh());
    this.observer.observe(this.host.nativeElement, {childList: true, subtree: true});
  }

  /**
   * Removes the key handler and disconnects the {@link MutationObserver}.
   * @internal
   */
  ngOnDestroy(): void {
    this.host.nativeElement.removeEventListener('keydown', this.captureKeydown, true);
    this.observer?.disconnect();
  }

  /**
   * Updates the active tab stop when focus enters one of the items (mouse / programmatic focus).
   * @param event The focus event.
   * @internal
   */
  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent): void {
    const target = (event.target as HTMLElement | null)?.closest(this.itemSelector()) as HTMLElement | null;

    if (target && this.items.includes(target)) {
      this.setActive(target);
    }
  }

  /**
   * @returns The navigable (enabled) items of the host, in DOM order.
   */
  private get items(): HTMLElement[] {
    const elements = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(this.itemSelector()));

    return elements.filter(
      (element) => !element.hasAttribute('disabled') && element.getAttribute('data-p-disabled') !== 'true'
    );
  }

  /**
   * Handles arrow navigation and activation in the capture phase.
   * @param event The keyboard event.
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Suppression is decided by the host (see `escape` output).
      this.escape.emit(event);

      return;
    }

    const items = this.items;

    if (items.length === 0) {
      return;
    }

    const current = items.findIndex(
      (element) => element === document.activeElement || element.getAttribute('tabindex') === '0'
    );

    if (current === NOT_FOUND) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      event.stopImmediatePropagation();
      items[current].click();
      this.itemActivate.emit(items[current]);

      return;
    }

    if (this.navigation() === 'grid') {
      this.handleGridNavigation(event, items, current);

      return;
    }

    const step = this.step(event.key);

    if (step === NO_STEP) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const target = items[this.targetIndex(current, step, items.length)];
    this.setActive(target);
    target.focus();
  }

  /**
   * Handles arrow-key navigation in `'grid'` mode by measuring the visual layout and
   * moving focus to the geometrically adjacent item.
   *
   * ArrowDown/ArrowUp move to the nearest item in the visual row below/above.
   * ArrowRight/ArrowLeft move within the current visual row and step to the adjacent row
   * at the row boundary (wrapping if {@link wrap} is `true`).
   * @param event The keyboard event.
   * @param items The navigable items in DOM order.
   * @param current The index of the currently active item within `items`.
   */
  private handleGridNavigation(event: KeyboardEvent, items: HTMLElement[], current: number): void {
    const key = event.key;
    const o = this.orientation();
    const allowH = o !== 'vertical';
    const allowV = o !== 'horizontal';

    const isHandled =
      (allowV && (key === 'ArrowDown' || key === 'ArrowUp')) ||
      (allowH && (key === 'ArrowRight' || key === 'ArrowLeft'));

    if (!isHandled) {
      return;
    }

    const rows = this.buildGridLayout(items);
    const currentElement = items[current];

    let rowIndex = NOT_FOUND;
    let cellIndexInRow = NOT_FOUND;

    for (let ri = 0; ri < rows.length; ri++) {
      const ci = rows[ri].cells.findIndex((c) => c.element === currentElement);

      if (ci !== NOT_FOUND) {
        rowIndex = ri;
        cellIndexInRow = ci;
        break;
      }
    }

    if (rowIndex === NOT_FOUND || cellIndexInRow === NOT_FOUND) {
      return;
    }

    const currentCenterX = rows[rowIndex].cells[cellIndexInRow].centerX;
    let targetElement: HTMLElement | undefined;

    if (key === 'ArrowDown') {
      const nextRow = rows[rowIndex + 1];
      targetElement = nextRow ? this.nearestInRow(nextRow, currentCenterX)?.element : undefined;
    } else if (key === 'ArrowUp') {
      const prevRow = rows[rowIndex - 1];
      targetElement = prevRow ? this.nearestInRow(prevRow, currentCenterX)?.element : undefined;
    } else if (key === 'ArrowRight') {
      const rowCells = rows[rowIndex].cells;

      if (cellIndexInRow < rowCells.length - 1) {
        targetElement = rowCells[cellIndexInRow + 1].element;
      } else if (rowIndex < rows.length - 1) {
        targetElement = rows[rowIndex + 1].cells[0]?.element;
      } else if (this.wrap()) {
        targetElement = rows[0]?.cells[0]?.element;
      }
    } else if (key === 'ArrowLeft') {
      const rowCells = rows[rowIndex].cells;

      if (cellIndexInRow > 0) {
        targetElement = rowCells[cellIndexInRow - 1].element;
      } else if (rowIndex > 0) {
        const prevRow = rows[rowIndex - 1];
        targetElement = prevRow.cells[prevRow.cells.length - 1]?.element;
      } else if (this.wrap()) {
        const lastRow = rows[rows.length - 1];
        targetElement = lastRow?.cells[lastRow.cells.length - 1]?.element;
      }
    }

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    this.setActive(targetElement);
    targetElement.focus();
  }

  /**
   * Finds the cell in `row` whose horizontal center is closest to `fromX`.
   * @param row The row to search.
   * @param fromX The reference horizontal center.
   * @returns The nearest cell, or `undefined` if the row is empty.
   */
  private nearestInRow(row: LayoutRow, fromX: number): LayoutCell | undefined {
    if (row.cells.length === 0) {
      return undefined;
    }

    return row.cells.reduce((best, cell) =>
      Math.abs(cell.centerX - fromX) < Math.abs(best.centerX - fromX) ? cell : best
    );
  }

  /**
   * Measures the visible items and groups them into visual rows sorted top-to-bottom,
   * left-to-right. Items with zero dimensions are skipped.
   * @param items The navigable items to lay out.
   * @returns The visual rows, each sorted by horizontal center.
   */
  private buildGridLayout(items: HTMLElement[]): LayoutRow[] {
    const rows: LayoutRow[] = [];

    for (const element of items) {
      const rect = element.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        continue;
      }

      const centerX = rect.left + rect.width / LAYOUT_DIVISOR;
      const top = rect.top;
      const tolerance = (rect.height || 1) / LAYOUT_DIVISOR;
      let row = rows.find((r) => Math.abs(top - r.top) <= tolerance);

      if (!row) {
        row = {top, cells: []};
        rows.push(row);
      }

      row.cells.push({element, centerX});
    }

    rows.sort((a, b) => a.top - b.top);
    rows.forEach((row) => row.cells.sort((a, b) => a.centerX - b.centerX));

    return rows;
  }

  /**
   * Maps an arrow key to a navigation step honoring the configured orientation.
   * @param key The pressed key.
   * @returns `1` for forward, `-1` for backward, `0` when the key is not handled.
   */
  private step(key: string): number {
    const orientation = this.orientation();

    if ((orientation !== 'vertical' && key === 'ArrowRight') || (orientation !== 'horizontal' && key === 'ArrowDown')) {
      return STEP_NEXT;
    }

    if ((orientation !== 'vertical' && key === 'ArrowLeft') || (orientation !== 'horizontal' && key === 'ArrowUp')) {
      return STEP_PREVIOUS;
    }

    return NO_STEP;
  }

  /**
   * Computes the target index applying optional wrap-around or clamping.
   * @param current The current index.
   * @param step The navigation step.
   * @param length The number of items.
   * @returns The resolved target index.
   */
  private targetIndex(current: number, step: number, length: number): number {
    const next = current + step;

    if (this.wrap()) {
      return (next + length) % length;
    }

    return Math.max(0, Math.min(length - 1, next));
  }

  /**
   * Re-applies the roving tabindex, keeping the current active item if it is still present.
   */
  private refresh(): void {
    const items = this.items;

    if (items.length === 0) {
      return;
    }

    const active =
      items.find((element) => element.getAttribute('tabindex') === '0') ??
      items.find(
        (element) => element.getAttribute('aria-pressed') === 'true' || element.getAttribute('aria-checked') === 'true'
      ) ??
      items[0];

    this.setActive(active);
  }

  /**
   * Marks a single item as the tabbable element and removes the rest from the tab order.
   * @param active The item to make tabbable.
   */
  private setActive(active: HTMLElement): void {
    for (const item of this.items) {
      item.setAttribute('tabindex', item === active ? '0' : '-1');
    }
  }
}
