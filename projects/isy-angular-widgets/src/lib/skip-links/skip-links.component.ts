import {Component, Input} from '@angular/core';
import {SkipTarget} from './model/model';
import {WidgetsConfigService} from '../i18n/widgets-config.service';

/**
 * Component that provides a set of skip links for accessibility purposes.
 * Allows users to quickly navigate to specific sections of the page.
 * @example
 * ```html
 * <isy-skip-links
  ariaLabel="{{ 'isyAngularWidgetsDemo.skipLinks.ariaLabel' | translate }}"
  [links]="skipLinks"
></isy-skip-links>
 * ```
 */
@Component({
  standalone: true,
  selector: 'isy-skip-links',
  templateUrl: './skip-links.component.html',
  styleUrls: ['./skip-links.component.scss']
})
export class SkipLinksComponent {
  @Input() links: SkipTarget[] = [];
  @Input() ariaLabel?: string;

  constructor(public configService: WidgetsConfigService) {}

  focusTarget(event: Event, target: string): void {
    event.preventDefault();
    const el = document.querySelector(target) as HTMLElement;

    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});

      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }

      el.focus();
    } else {
      console.warn(
        `[SkipLinksComponent]: Target '${target}' not found. Please check if the element with '${target}' exists in the DOM.`
      );
    }
  }
}
