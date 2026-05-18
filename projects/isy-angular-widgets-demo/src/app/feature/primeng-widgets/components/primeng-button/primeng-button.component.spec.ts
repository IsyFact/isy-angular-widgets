import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengButtonComponent} from './primeng-button.component';

describe('Unit Tests: PrimengButtonComponent', () => {
  const sectionAnchorIds = ['colored-buttons', 'outlined-buttons', 'icon-buttons', 'splitbutton', 'speeddial'];

  let component: PrimengButtonComponent;
  let spectator: Spectator<PrimengButtonComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengButtonComponent,
    providers: [
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}},
      {provide: ViewportScroller, useValue: viewportScrollerMock}
    ]
  });

  beforeEach(() => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section headings with hover-only anchor symbols for colored/outlined/icon groups', () => {
    ['colored-buttons', 'outlined-buttons', 'icon-buttons'].forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h2#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h2#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render section headings with hover-only anchor symbols for special buttons', () => {
    ['splitbutton', 'speeddial'].forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render the colored/outlined/icon sections as a two-column flat list', () => {
    const rows = spectator.queryAll<HTMLElement>('.grid .col-12 .flex.flex-column.gap-2 .grid.align-items-center');

    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => {
      expect(row.querySelector('.col-4')).toBeTruthy();
      expect(row.querySelector('.col-8')).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('colored-buttons');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('colored-buttons');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();
      const selector = id === 'splitbutton' || id === 'speeddial' ? `h3#${id} > a` : `h2#${id} > a`;

      spectator.click(selector);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h2#colored-buttons');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });
});
