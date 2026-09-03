import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengDataComponent} from './primeng-data.component';

describe('Unit Tests: PrimengDataComponent', () => {
  const sectionAnchorIds = ['organizationchart', 'timeline', 'scroller', 'tree', 'paginator', 'table', 'treetable'];

  let component: PrimengDataComponent;
  let spectator: Spectator<PrimengDataComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengDataComponent,
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

  it('should render section headings with hover-only anchor symbols for data view widgets', () => {
    ['organizationchart', 'timeline', 'scroller', 'tree'].forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render section headings with hover-only anchor symbols for table widgets', () => {
    ['paginator', 'table', 'treetable'].forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render all widgets in full-width containers', () => {
    const fullWidthContainers = spectator.queryAll<HTMLElement>('.col-span-12.flex.flex-col.gap-2');

    expect(fullWidthContainers.length).toBeGreaterThanOrEqual(sectionAnchorIds.length);
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-span-12.flex.flex-col.gap-2 h3#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('timeline');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('timeline');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();

      spectator.click(`h3#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h3#timeline');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should exclude data controls from print while keeping the rendered table pages', () => {
    const paginatorSection = spectator.query('h3#paginator')?.closest<HTMLElement>('.col-span-12');
    const printableTables = spectator.queryAll('p-table.isy-print-table, p-treetable.isy-print-table');
    const columnControls = spectator.queryAll(
      'p-table p-columnfilter, p-table p-sorticon, p-treetable p-treetablesorticon'
    );
    const visibleProductRows = spectator.queryAll('p-table tbody tr');
    const visibleTreeTableRows = spectator.queryAll('p-treetable tbody tr');
    const currentItemsScroller = spectator.query('p-scroller.isy-print-current-items');

    expect(paginatorSection?.classList.contains('isy-print-hide')).toBeTrue();
    expect(printableTables.length).toBe(2);
    expect(columnControls.length).toBeGreaterThan(0);
    expect(columnControls.every((control) => control.closest('.isy-print-hide'))).toBeTrue();
    expect(visibleProductRows.length).toBe(5);
    expect(visibleTreeTableRows.length).toBe(3);
    expect(currentItemsScroller).toBeTruthy();
  });
});
