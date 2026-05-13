import {Component, inject, Input} from '@angular/core';
import {AnchorNavigationService} from '../../services/anchor-navigation.service';

/** Allowed heading levels rendered by {@link SectionHeadingComponent}. */
export type HeadingLevel = 2 | 3;

/**
 * Renders a section heading (`<h2>` or `<h3>`) with an accessible hover-only
 * anchor link that scrolls to itself and updates the URL fragment.
 *
 * Usage:
 * ```html
 * <demo-section-heading headingId="my-section" [level]="2" label="My Section" ariaLabel="Link zu My Section" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'demo-section-heading',

  template: `
    @if (level === H2) {
      <h2 [id]="anchorId" class="section-heading">
        {{ label }}
        <a
          class="section-anchor"
          [href]="'#' + anchorId"
          (click)="anchorNav.scrollToAnchor($event, anchorId)"
          [attr.aria-label]="ariaLabel"
          >🔗</a
        >
      </h2>
    } @else {
      <h3 [id]="anchorId" class="section-heading">
        {{ label }}
        <a
          class="section-anchor"
          [href]="'#' + anchorId"
          (click)="anchorNav.scrollToAnchor($event, anchorId)"
          [attr.aria-label]="ariaLabel"
          >🔗</a
        >
      </h3>
    }
  `
})
export class SectionHeadingComponent {
  private static readonly DEFAULT_LEVEL: HeadingLevel = 2;

  /** The `id` of the rendered heading element used as fragment target. */
  @Input({required: true}) anchorId!: string;
  /** The visible text of the heading. */
  @Input({required: true}) label!: string;
  /** The `aria-label` of the anchor link, e.g. `"Link zu FormWrapper"`. */
  @Input({required: true}) ariaLabel!: string;
  /** Heading level: `2` renders `<h2>`, `3` renders `<h3>`. Defaults to `2`. */
  @Input() level: HeadingLevel = SectionHeadingComponent.DEFAULT_LEVEL;

  protected readonly anchorNav = inject(AnchorNavigationService);
  protected readonly H2: HeadingLevel = SectionHeadingComponent.DEFAULT_LEVEL;
}
