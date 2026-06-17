import {AfterViewInit, Directive, ElementRef, HostListener, inject, input, OnDestroy} from '@angular/core';

const DEFAULT_ITEM_SELECTOR = 'p-togglebutton, p-accordion-header, [role="button"], [role="radio"]';
const NOT_FOUND = -1;
const STEP_PREVIOUS = -1;
const STEP_NEXT = 1;
const NO_STEP = 0;

/**
 * Orientation of the roving navigation.
 * @internal
 */
type RovingOrientation = 'horizontal' | 'vertical' | 'both';

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
        (element) =>
          element.getAttribute('aria-pressed') === 'true' || element.getAttribute('aria-checked') === 'true'
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
