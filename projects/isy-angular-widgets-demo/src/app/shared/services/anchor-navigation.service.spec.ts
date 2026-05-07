import {TestBed} from '@angular/core/testing';
import {ViewportScroller} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {AnchorNavigationService} from './anchor-navigation.service';
import {Component, DestroyRef, inject, OnInit} from '@angular/core';

// ---------------------------------------------------------------------------
// Helper: tiny host component that calls initFragmentScroll so we have a
// proper DestroyRef in injection context.
// ---------------------------------------------------------------------------
@Component({standalone: true, template: ''})
class HostComponent implements OnInit {
  readonly anchorNav = inject(AnchorNavigationService);
  readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }
}

describe('AnchorNavigationService', () => {
  let service: AnchorNavigationService;
  let viewportScrollerSpy: jasmine.SpyObj<ViewportScroller>;
  const fragment$ = new Subject<string | null>();

  beforeEach(() => {
    viewportScrollerSpy = jasmine.createSpyObj<ViewportScroller>('ViewportScroller', ['scrollToAnchor']);

    TestBed.configureTestingModule({
      providers: [
        AnchorNavigationService,
        {provide: ViewportScroller, useValue: viewportScrollerSpy},
        {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}}
      ]
    });

    service = TestBed.inject(AnchorNavigationService);
  });

  describe('scrollToAnchor()', () => {
    it('should prevent the default browser navigation', () => {
      const event = new MouseEvent('click', {bubbles: true, cancelable: true});
      service.scrollToAnchor(event, 'some-section');
      expect(event.defaultPrevented).toBeTrue();
    });

    it('should call ViewportScroller.scrollToAnchor with the given id', () => {
      const event = new MouseEvent('click');
      service.scrollToAnchor(event, 'target-section');
      expect(viewportScrollerSpy.scrollToAnchor).toHaveBeenCalledWith('target-section');
    });
  });

  describe('initFragmentScroll()', () => {
    it('should scroll to anchor when a non-null fragment is emitted', () => {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges(); // triggers ngOnInit → initFragmentScroll

      fragment$.next('some-anchor');

      expect(viewportScrollerSpy.scrollToAnchor).toHaveBeenCalledWith('some-anchor');
    });

    it('should not scroll when fragment is null', () => {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      fragment$.next(null);

      expect(viewportScrollerSpy.scrollToAnchor).not.toHaveBeenCalled();
    });
  });
});
