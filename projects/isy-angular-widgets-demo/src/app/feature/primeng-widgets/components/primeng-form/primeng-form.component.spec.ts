import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengFormComponent} from './primeng-form.component';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

describe('Unit Tests: PrimengFormComponent', () => {
  const widgetAnchorIds = [
    'inputtext', 'inputmask', 'autocomplete', 'iconfield', 'inputgroup',
    'keyfilter', 'password', 'calendar', 'inputnumber', 'cascadeselect',
    'dropdown', 'multiselect', 'treeselect', 'textarea', 'inputotp',
    'checkbox', 'radiobutton', 'knob', 'tristatecheckbox', 'rating',
    'slider', 'inputswitch', 'togglebutton', 'selectbutton',
    'colorpicker', 'chips', 'listbox', 'editor'
  ];

  let component: PrimengFormComponent;
  let spectator: Spectator<PrimengFormComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengFormComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {fragment: fragment$.asObservable()}
      },
      {
        provide: ViewportScroller,
        useValue: viewportScrollerMock
      }
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

  it('should expose a linkable heading per widget', () => {
    const headingLinks = spectator.queryAll<HTMLAnchorElement>('h3 > a');

    expect(headingLinks).toHaveLength(widgetAnchorIds.length);

    widgetAnchorIds.forEach(id => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchorLink = spectator.query<HTMLAnchorElement>(`h3#${id} > a[href="#${id}"]`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchorLink).toBeTruthy();
      expect(anchorLink?.classList.contains('section-anchor')).toBeTrue();
      expect(anchorLink?.textContent?.trim()).toBe('#');
    });
  });

  it('should render widgets in a single-column layout', () => {
    expect(spectator.queryAll('[class*="xl:col-"]')).toHaveLength(0);
    expect(spectator.queryAll('[class*="md:col-"]')).toHaveLength(0);
  });

  it('should scroll to the fragment anchor after initialization', () => {
    fragment$.next('inputtext');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('inputtext');
  });

  it('should scroll to a widget when anchor symbol is clicked', () => {
    spectator.click('h3#inputtext > a[href="#inputtext"]');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('inputtext');
  });

  it('should not scroll when clicking only the section heading text', () => {
    spectator.click('h3#inputtext');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should filter countries with partial match', () => {
    const query = 'Uni';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.startsWith('Uni'))).toBeTrue();
  });

  it('should handle empty query', () => {
    const query = '';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBe(component.countries.length);
  });

  it('should handle query with no matching countries', () => {
    const query = 'xyz';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBe(0);
  });

  it('should handle case insensitive queries', () => {
    const query = 'united';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.toLowerCase().startsWith('united'))).toBeTrue();
  });

  it('should handle query with mixed case', () => {
    const query = 'UniTeD';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.toLowerCase().startsWith('united'))).toBeTrue();
  });

  it('should handle query with special characters', () => {
    const query = 'U*ni';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBe(0);
  });
});
