import {DestroyRef, inject, Injectable} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/**
 * Shared service for anchor-based in-page navigation used by demo page components.
 *
 * Centralises two recurring behaviours that were previously duplicated in every
 * demo page component:
 *  1. Scrolling to a URL fragment on initial navigation (`initFragmentScroll`).
 *  2. Programmatic scroll-to-anchor with browser history update (`scrollToAnchor`).
 */
@Injectable({
  providedIn: 'root'
})
export class AnchorNavigationService {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly activatedRoute = inject(ActivatedRoute);

  /**
   * Builds an absolute in-page anchor URL for the current route.
   * This makes copied links include the full page path plus fragment.
   * @param anchor - The id of the target element.
   * @returns The current page URL with fragment (e.g. `/primeng-widgets/primeng-form#date-picker`).
   */
  buildAnchorHref(anchor: string): string {
    return `${globalThis.location.pathname}${globalThis.location.search}#${anchor}`;
  }

  /**
   * Subscribes to the current route's fragment and scrolls to the matching
   * anchor whenever the fragment changes.  The subscription is automatically
   * cleaned up when the given `DestroyRef` fires.
   *
   * Call this once inside `ngAfterViewInit` of the host component.
   * @param destroyRef - The component's `DestroyRef` token used for automatic cleanup.
   */
  initFragmentScroll(destroyRef: DestroyRef): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  /**
   * Scrolls to the element with the given `anchor` id and updates the browser
   * history so that the URL fragment reflects the current position without
   * triggering a full navigation.
   *
   * Intended to be bound to the `(click)` handler of in-page anchor links.
   * @param event  - The originating `MouseEvent` whose default action is prevented.
   * @param anchor - The id of the target element to scroll to.
   */
  scrollToAnchor(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    globalThis.history.replaceState(globalThis.history.state, '', this.buildAnchorHref(anchor));
  }
}
