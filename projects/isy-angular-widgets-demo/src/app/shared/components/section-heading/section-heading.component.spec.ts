import {ViewportScroller} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {Subject} from 'rxjs';
import {AnchorNavigationService} from '../../services/anchor-navigation.service';
import {SectionHeadingComponent} from './section-heading.component';

describe('SectionHeadingComponent', () => {
  let spectator: Spectator<SectionHeadingComponent>;
  let viewportScrollerSpy: jasmine.SpyObj<ViewportScroller>;
  const fragment$ = new Subject<string | null>();

  const createComponent = createComponentFactory({
    component: SectionHeadingComponent,
    providers: [
      AnchorNavigationService,
      {
        provide: ViewportScroller,
        useValue: jasmine.createSpyObj<ViewportScroller>('ViewportScroller', ['scrollToAnchor'])
      },
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}}
    ],
    declareComponent: false
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {headingId: 'my-section', label: 'My Section', ariaLabel: 'Link zu My Section', level: 2}
    });
    viewportScrollerSpy = spectator.inject(ViewportScroller) as jasmine.SpyObj<ViewportScroller>;
  });

  describe('level 2 (default)', () => {
    it('should render an h2 with the given id and class', () => {
      const h2 = spectator.query<HTMLHeadingElement>('h2#my-section');
      expect(h2).toBeTruthy();
      expect(h2?.classList.contains('section-heading')).toBeTrue();
    });

    it('should render the label text', () => {
      expect(spectator.query('h2')?.textContent).toContain('My Section');
    });

    it('should render an anchor with href="#headingId" and the given aria-label', () => {
      const a = spectator.query<HTMLAnchorElement>('a.section-anchor');
      expect(a).toBeTruthy();
      expect(a?.getAttribute('href')).toBe('#my-section');
      expect(a?.getAttribute('aria-label')).toBe('Link zu My Section');
      expect(a?.textContent?.trim()).toBe('🔗');
    });

    it('should not render an h3', () => {
      expect(spectator.query('h3')).toBeNull();
    });
  });

  describe('level 3', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {headingId: 'sub-section', label: 'Sub Section', ariaLabel: 'Link zu Sub Section', level: 3}
      });
    });

    it('should render an h3 with the given id', () => {
      const h3 = spectator.query<HTMLHeadingElement>('h3#sub-section');
      expect(h3).toBeTruthy();
    });

    it('should not render an h2', () => {
      expect(spectator.query('h2')).toBeNull();
    });
  });

  describe('anchor click', () => {
    it('should call ViewportScroller.scrollToAnchor when the link is clicked', () => {
      spectator.click('a.section-anchor');
      expect(viewportScrollerSpy.scrollToAnchor).toHaveBeenCalledWith('my-section');
    });
  });
});
