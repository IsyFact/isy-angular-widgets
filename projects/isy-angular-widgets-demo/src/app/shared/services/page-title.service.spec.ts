import {createServiceFactory, SpectatorService, mockProvider, SpyObject} from '@ngneat/spectator';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {PageTitleService} from './page-title.service';
import {BehaviorSubject, Subject} from 'rxjs';

describe('PageTitleService', () => {
  let spectator: SpectatorService<PageTitleService>;
  let router: SpyObject<Router>;
  const mockRouter = {
    events: new BehaviorSubject<NavigationEnd>(new NavigationEnd(1, '/dashboard', '/objekt-suchen'))
  };
  const routeData = new BehaviorSubject<{title?: string}>({title: 'Test Page'});

  const mockActivatedRoute = {
    root: new BehaviorSubject({
      firstChild: {
        snapshot: {},
        data: routeData
      }
    })
  };

  const createService = createServiceFactory({
    service: PageTitleService,
    mocks: [Title, TranslateService],
    providers: [
      mockProvider(Router, mockRouter),
      {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute
      }
    ]
  });

  beforeEach(() => {
    spectator = createService();
    router = spectator.inject(Router);
  });

  it('should create', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should set translated title and announce page change on navigation end', () => {
    spectator.service.setupPageTitle();
    expect(spectator.service).toBeDefined();
  });

  it('should create a live region element', () => {
    expect(spectator.service.liveRegion).toBeDefined();
  });

  it('should announce a message', () => {
    const message = 'Test message';
    spectator.service.announce(message);
    expect(spectator.service.liveRegion?.textContent).toBe(message);
  });

  it('should handle focus request after title change', () => {
    spectator.service.setupPageTitle();
    let focusedElementId = 'inputElementId';
    spectator.service.requestFocusChange.subscribe((id) => (focusedElementId = id));
    spectator.service.requestFocusChange.next('newElementId');
    (router.events as Subject<unknown>).next(new NavigationEnd(1, '/dashboard', '/objekt-suchen'));
    expect(focusedElementId).toEqual('newElementId');
  });
});
