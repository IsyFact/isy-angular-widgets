import {AfterViewInit, Directive, ElementRef, HostListener, inject, OnDestroy} from '@angular/core';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]';
const INACTIVE_TABINDEX = -1;

/**
 * Turns its host element into a single keyboard tab stop ("roving tabindex").
 *
 * All focusable descendants except the active one are set to `tabindex="-1"`, so the
 * whole panel is entered with a single Tab. Internal movement is left to the embedded
 * widgets (e.g. PrimeNG accordion / select button arrow handling); this directive only
 * keeps exactly one descendant tabbable and remembers the last focused element so
 * tabbing back returns to it.
 * @internal
 */
@Directive({
  selector: '[isyRovingTabindex]',
  standalone: true
})
export class RovingTabindexDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private observer?: MutationObserver;

  private applying = false;

  private activeElement?: HTMLElement;

  /**
   * Updates the active tab stop when focus enters one of the focusable descendants.
   * @param event The focus event.
   * @internal
   */
  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    const focusables = this.getFocusables();

    if (!target || !focusables.includes(target)) {
      return;
    }

    this.setActive(target, focusables);
  }

  /**
   * Initializes the roving tabindex and observes DOM changes to re-apply it.
   * @internal
   */
  ngAfterViewInit(): void {
    queueMicrotask(() => this.refresh());

    this.observer = new MutationObserver(() => {
      if (!this.applying) {
        this.refresh();
      }
    });

    this.observer.observe(this.host.nativeElement, {childList: true, subtree: true});
  }

  /**
   * Disconnects the {@link MutationObserver}.
   * @internal
   */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Re-applies the roving tabindex, keeping the previously active element if it is still present.
   */
  private refresh(): void {
    const focusables = this.getFocusables();

    if (focusables.length === 0) {
      return;
    }

    const active = this.activeElement && focusables.includes(this.activeElement) ? this.activeElement : focusables[0];

    this.setActive(active, focusables);
  }

  /**
   * Marks a single descendant as the tabbable element and removes the rest from the tab order.
   * @param active The element to make tabbable.
   * @param focusables All focusable descendants.
   */
  private setActive(active: HTMLElement, focusables: HTMLElement[]): void {
    this.applying = true;
    this.activeElement = active;

    for (const element of focusables) {
      element.tabIndex = element === active ? 0 : INACTIVE_TABINDEX;
    }

    this.applying = false;
  }

  /**
   * Collects the visible, enabled focusable descendants of the host.
   * @returns The focusable descendant elements.
   */
  private getFocusables(): HTMLElement[] {
    const elements = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    return elements.filter((element) => !element.hasAttribute('disabled') && element.getClientRects().length > 0);
  }
}
