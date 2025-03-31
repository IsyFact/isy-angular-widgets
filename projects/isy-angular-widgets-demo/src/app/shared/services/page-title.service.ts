import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router, Event, RouterEvent} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subject, filter, map, mergeMap, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service responsible for managing the page title and providing accessibility features.
 */
export class PageTitleService {
  liveRegion?: HTMLElement;
  requestFocusChange: Subject<string> = new Subject<string>();

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService
  ) {
    this.createLiveRegion();
  }

  /**
   * Sets up the page title based on the current route.
   * This method listens to router events and updates the page title accordingly.
   */
  setupPageTitle(): void {
    this.router.events
      .pipe(
        filter((event: Event | RouterEvent) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        filter((data): data is {title?: string} => !!data && typeof data === 'object'),
        switchMap((data) => {
          const keys = [data.title ?? '', 'isyAngularWidgetsDemo.messages.changePage'];
          return this.translate.get(keys).pipe(
            map((res: {[key: string]: string}) => ({
              title: res[data.title ?? ''],
              message: res['isyAngularWidgetsDemo.messages.changePage']
            }))
          );
        }),
        tap(({title, message}) => {
          if (title) {
            this.titleService.setTitle(title);
            this.announce(`${message} ${title}`);
            this.requestFocusChange.next('inputElementId');
          }
        })
      )
      .subscribe(() => {});
  }

  /**
   * Creates a live region element for accessibility purposes.
   * The live region is a hidden element that is used to announce dynamic changes to screen readers.
   */
  createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.marginTop = '-1px';
    this.liveRegion.style.clipPath = 'inset(1px)';
    this.liveRegion.style.overflow = 'hidden';
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announces a message by updating the live region content.
   * @param message - The message to be announced.
   */
  announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }
}
