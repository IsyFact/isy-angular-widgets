import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';

/**
 * A single measured cell within the grid layout map.
 * @internal
 */
interface GridCell {
  /** Index of the cell within the {@link InputCharGridComponent.characters} array. */
  index: number;
  /** The horizontal center of the cell in viewport coordinates. */
  centerX: number;
  /** Whether the cell is disabled and must be skipped during navigation. */
  disabled: boolean;
}

/**
 * A visual row of the grid, built from measured cell positions.
 * @internal
 */
interface GridRow {
  /** The top offset of the row in viewport coordinates. */
  top: number;
  /** The cells of the row, ordered left to right. */
  cells: GridCell[];
}

/**
 * The resolved position of a cell within the layout map.
 * @internal
 */
interface CellPosition {
  /** Index of the row within the layout map. */
  rowIndex: number;
  /** The measured cell. */
  cell: GridCell;
}

/**
 * Predicate deciding whether a character is disabled within the grid.
 * @internal
 */
type DisabledPredicate = (zeichenObjekt: Zeichenobjekt) => boolean;

const RESIZE_DEBOUNCE_MS = 100;
const FALLBACK_PAGE_ROWS = 5;
const INACTIVE_INDEX = -1;
const CENTER_DIVISOR = 2;

/**
 * Accessible character grid implemented as a WAI-ARIA listbox with a roving tabindex.
 *
 * Navigation is strictly geometric (based on measured bounding rects), supports
 * selection-follows-focus and skips disabled cells. The component owns its own
 * `keydown` handling instead of relying on PrimeNG's `p-selectButton`, which has no
 * notion of a 2D grid geometry.
 * @internal
 */
@Component({
  standalone: true,
  selector: 'isy-input-char-grid',
  templateUrl: './input-char-grid.component.html',
  styleUrls: ['./input-char-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCharGridComponent implements OnChanges, AfterViewInit, OnDestroy {
  /**
   * The characters to display, in reading (DOM) order.
   */
  @Input() characters: Zeichenobjekt[] = [];

  /**
   * The currently selected character.
   */
  @Input() selected: Zeichenobjekt | undefined;

  /**
   * Accessible label for the listbox container.
   */
  @Input() ariaLabel = '';

  // eslint-disable-next-line jsdoc/require-returns -- function-typed input, documented via its type alias
  /**
   * Predicate deciding whether a character is disabled (non-selectable) within the grid.
   */
  @Input() isDisabled: DisabledPredicate = () => false;

  /**
   * Emits whenever the selection changes (selection follows focus).
   */
  @Output() selectedChange = new EventEmitter<Zeichenobjekt | undefined>();

  /**
   * Emits when the user confirms the current selection (Enter), equivalent to the insert button.
   */
  @Output() insert = new EventEmitter<void>();

  /**
   * The listbox container element.
   * @internal
   */
  @ViewChild('listbox', {static: true}) listboxRef!: ElementRef<HTMLElement>;

  /**
   * The rendered option cells, in DOM order.
   * @internal
   */
  @ViewChildren('cell') cells!: QueryList<ElementRef<HTMLElement>>;

  /**
   * Index of the cell that currently holds the roving tabindex (`tabindex="0"`).
   * @internal
   */
  activeIndex = INACTIVE_INDEX;

  private rows: GridRow[] = [];

  private indexToPosition = new Map<number, CellPosition>();

  private layoutDirty = true;

  private resizeObserver?: ResizeObserver;

  private resizeTimer?: ReturnType<typeof setTimeout>;

  /**
   * Recomputes the active (roving) cell and invalidates the cached layout when the
   * character list or selection changes.
   * @param changes The changed inputs.
   * @internal
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.characters) {
      this.layoutDirty = true;
    }

    if (changes.characters || changes.selected) {
      this.activeIndex = this.computeActiveIndex();
    }
  }

  /**
   * Sets up the {@link ResizeObserver} that keeps the layout map in sync with the viewport.
   * @internal
   */
  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.scheduleLayoutRebuild());
    this.resizeObserver.observe(this.listboxRef.nativeElement);
  }

  /**
   * Tears down the {@link ResizeObserver} and any pending debounce timer.
   * @internal
   */
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  /**
   * Returns the tabindex for the cell at the given index (roving tabindex).
   * @param index The cell index.
   * @returns `0` for the active cell, `-1` otherwise.
   * @internal
   */
  getTabindex(index: number): number {
    return index === this.activeIndex ? 0 : INACTIVE_INDEX;
  }

  /**
   * Builds the accessible label for a single character cell.
   * @param zeichenObjekt The character to describe.
   * @returns A label combining the character name and its codepoint.
   * @internal
   */
  getCellAriaLabel(zeichenObjekt: Zeichenobjekt): string {
    return `${zeichenObjekt.name} (${zeichenObjekt.codepoint})`;
  }

  /**
   * Handles a click on a cell: selects it without inserting (mouse parity).
   * @param index The clicked cell index.
   * @internal
   */
  onCellClick(index: number): void {
    const zeichenObjekt = this.characters[index];

    if (!zeichenObjekt || this.isDisabled(zeichenObjekt)) {
      return;
    }

    this.activate(index);
  }

  /**
   * Handles keyboard interaction on the grid.
   * @param event The keyboard event.
   * @param index The index of the focused cell.
   * @internal
   */
  onKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown': {
        event.preventDefault();
        event.stopPropagation();
        const target = this.resolveTarget(event.key, index);

        if (target !== undefined) {
          this.activate(target);
        }

        break;
      }
      case 'Enter': {
        event.preventDefault();
        event.stopPropagation();
        this.confirmSelection(index);

        break;
      }
      case ' ':
      case 'Spacebar': {
        event.preventDefault();
        event.stopPropagation();
        this.onCellClick(index);

        break;
      }
      default:
        break;
    }
  }

  /**
   * Determines the target cell index for a navigation key, or `undefined` when the
   * focus must stay on the current cell (geometric clamp / no valid target).
   * @param key The pressed navigation key.
   * @param index The current cell index.
   * @returns The target cell index or `undefined`.
   */
  private resolveTarget(key: string, index: number): number | undefined {
    this.ensureLayout();

    const position = this.indexToPosition.get(index);

    if (!position) {
      return undefined;
    }

    const {rowIndex, cell} = position;

    switch (key) {
      case 'ArrowRight':
        return this.findInRow(rowIndex, cell.centerX, 'right');
      case 'ArrowLeft':
        return this.findInRow(rowIndex, cell.centerX, 'left');
      case 'ArrowDown':
        return this.findInColumn(rowIndex + 1, cell.centerX);
      case 'ArrowUp':
        return this.findInColumn(rowIndex - 1, cell.centerX);
      case 'Home':
        return this.firstValidIndex();
      case 'End':
        return this.lastValidIndex();
      case 'PageDown':
        return this.findPage(rowIndex, cell.centerX, 'down');
      case 'PageUp':
        return this.findPage(rowIndex, cell.centerX, 'up');
      default:
        return undefined;
    }
  }

  /**
   * Finds the nearest valid cell in the same row in the given horizontal direction.
   * @param rowIndex The row to search.
   * @param fromX The horizontal center to navigate away from.
   * @param direction The horizontal direction.
   * @returns The target cell index, or `undefined` if none exists.
   */
  private findInRow(rowIndex: number, fromX: number, direction: 'left' | 'right'): number | undefined {
    const row = this.rows[rowIndex];

    if (!row) {
      return undefined;
    }

    const candidates = row.cells.filter(
      (cell) => !cell.disabled && (direction === 'right' ? cell.centerX > fromX : cell.centerX < fromX)
    );

    if (candidates.length === 0) {
      return undefined;
    }

    const nearest = candidates.reduce((best, cell) =>
      Math.abs(cell.centerX - fromX) < Math.abs(best.centerX - fromX) ? cell : best
    );

    return nearest.index;
  }

  /**
   * Finds the column-nearest valid cell in the given (adjacent) row. Does not jump
   * across multiple rows: returns `undefined` if the target row has no valid cell.
   * @param rowIndex The target row index.
   * @param fromX The horizontal center to align to.
   * @returns The target cell index, or `undefined`.
   */
  private findInColumn(rowIndex: number, fromX: number): number | undefined {
    const row = this.rows[rowIndex];

    if (!row) {
      return undefined;
    }

    const candidates = row.cells.filter((cell) => !cell.disabled);

    if (candidates.length === 0) {
      return undefined;
    }

    const nearest = candidates.reduce((best, cell) =>
      Math.abs(cell.centerX - fromX) < Math.abs(best.centerX - fromX) ? cell : best
    );

    return nearest.index;
  }

  /**
   * Resolves the target cell for PageUp / PageDown.
   * @param rowIndex The current row index.
   * @param fromX The horizontal center to align to.
   * @param direction The vertical paging direction.
   * @returns The target cell index, or `undefined`.
   */
  private findPage(rowIndex: number, fromX: number, direction: 'up' | 'down'): number | undefined {
    if (this.rows.length === 0) {
      return undefined;
    }

    const lastRow = this.rows.length - 1;
    let targetRow: number;

    if (this.isScrollable()) {
      const step = this.pageRows();
      targetRow = direction === 'down' ? Math.min(rowIndex + step, lastRow) : Math.max(rowIndex - step, 0);
    } else {
      targetRow = direction === 'down' ? lastRow : 0;
    }

    return this.findInColumn(targetRow, fromX);
  }

  /**
   * @returns The index of the first non-disabled character, or `undefined` if none.
   */
  private firstValidIndex(): number | undefined {
    const index = this.characters.findIndex((zeichenObjekt) => !this.isDisabled(zeichenObjekt));

    return index === INACTIVE_INDEX ? undefined : index;
  }

  /**
   * @returns The index of the last non-disabled character, or `undefined` if none.
   */
  private lastValidIndex(): number | undefined {
    for (let index = this.characters.length - 1; index >= 0; index--) {
      if (!this.isDisabled(this.characters[index])) {
        return index;
      }
    }

    return undefined;
  }

  /**
   * @returns Whether the listbox viewport is vertically scrollable.
   */
  private isScrollable(): boolean {
    const element = this.listboxRef.nativeElement;

    return element.scrollHeight > element.clientHeight + 1;
  }

  /**
   * @returns The number of fully visible rows per viewport page (at least one).
   */
  private pageRows(): number {
    const firstCell = this.cells.first?.nativeElement;
    const rowHeight = firstCell?.getBoundingClientRect().height ?? 0;
    const viewportHeight = this.listboxRef.nativeElement.clientHeight;

    if (rowHeight <= 0 || viewportHeight <= 0) {
      return FALLBACK_PAGE_ROWS;
    }

    return Math.max(1, Math.floor(viewportHeight / rowHeight));
  }

  /**
   * Selects, focuses and scrolls the cell at the given index into view.
   * @param index The target cell index.
   */
  private activate(index: number): void {
    const zeichenObjekt = this.characters[index];

    if (!zeichenObjekt) {
      return;
    }

    this.activeIndex = index;

    if (zeichenObjekt !== this.selected) {
      this.selected = zeichenObjekt;
      this.selectedChange.emit(zeichenObjekt);
    }

    const element = this.cells.get(index)?.nativeElement;

    if (!element) {
      return;
    }

    element.focus();
    element.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }

  /**
   * Emits the insert event for the focused cell, mirroring the insert button.
   * @param index The focused cell index.
   */
  private confirmSelection(index: number): void {
    const zeichenObjekt = this.characters[index];

    if (!zeichenObjekt || this.isDisabled(zeichenObjekt)) {
      return;
    }

    if (zeichenObjekt !== this.selected) {
      this.selected = zeichenObjekt;
      this.selectedChange.emit(zeichenObjekt);
    }

    this.insert.emit();
  }

  /**
   * Computes the cell that should carry the roving tabindex: the selected cell if it
   * is present and enabled, otherwise the first valid cell.
   * @returns The active cell index, or `-1` when no valid cell exists.
   */
  private computeActiveIndex(): number {
    if (this.selected) {
      const selectedIndex = this.characters.indexOf(this.selected);

      if (selectedIndex !== INACTIVE_INDEX && !this.isDisabled(this.characters[selectedIndex])) {
        return selectedIndex;
      }
    }

    return this.firstValidIndex() ?? INACTIVE_INDEX;
  }

  /**
   * Rebuilds the cached layout map if it has been invalidated.
   */
  private ensureLayout(): void {
    if (this.layoutDirty || this.rows.length === 0) {
      this.buildLayout();
    }
  }

  /**
   * Schedules a debounced rebuild of the layout map (used by the {@link ResizeObserver}).
   */
  private scheduleLayoutRebuild(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = undefined;
      this.buildLayout();
    }, RESIZE_DEBOUNCE_MS);
  }

  /**
   * Measures all cells and groups them into rows by their vertical position.
   */
  private buildLayout(): void {
    const elements = this.cells.toArray().map((ref) => ref.nativeElement);

    const measured = elements.map((element, index) => {
      const rect = element.getBoundingClientRect();

      return {
        index,
        centerX: rect.left + rect.width / CENTER_DIVISOR,
        top: rect.top,
        height: rect.height,
        disabled: this.isDisabled(this.characters[index])
      };
    });

    measured.sort((a, b) => a.top - b.top || a.centerX - b.centerX);

    const rows: GridRow[] = [];

    for (const cell of measured) {
      const tolerance = (cell.height || 1) / CENTER_DIVISOR;
      const row = rows.find((candidate) => Math.abs(cell.top - candidate.top) <= tolerance);
      const target = row ?? this.appendRow(rows, cell.top);

      target.cells.push({index: cell.index, centerX: cell.centerX, disabled: cell.disabled});
    }

    rows.sort((a, b) => a.top - b.top);
    rows.forEach((row) => row.cells.sort((a, b) => a.centerX - b.centerX));

    this.rows = rows;
    this.indexToPosition = new Map();

    rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell) => this.indexToPosition.set(cell.index, {rowIndex, cell}));
    });

    this.layoutDirty = false;
  }

  /**
   * Creates and registers a new row in the layout map.
   * @param rows The current rows.
   * @param top The top offset of the new row.
   * @returns The newly created row.
   */
  private appendRow(rows: GridRow[], top: number): GridRow {
    const row: GridRow = {top, cells: []};
    rows.push(row);

    return row;
  }
}
