import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengFormComponent} from './primeng-form.component';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {TranslateModule} from '@ngx-translate/core';

describe('Unit Tests: PrimengFormComponent', () => {
  const widgetAnchorIds = [
    'inputtext',
    'inputmask',
    'autocomplete',
    'iconfield',
    'inputgroup',
    'keyfilter',
    'password',
    'calendar',
    'inputnumber',
    'cascadeselect',
    'dropdown',
    'multiselect',
    'treeselect',
    'textarea',
    'inputotp',
    'checkbox',
    'radiobutton',
    'knob',
    'tristatecheckbox',
    'rating',
    'slider',
    'inputswitch',
    'togglebutton',
    'selectbutton',
    'colorpicker',
    'chips',
    'listbox',
    'editor'
  ];

  let component: PrimengFormComponent;
  let spectator: Spectator<PrimengFormComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengFormComponent,
    imports: [TranslateModule.forRoot()],
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

    widgetAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchorLink = spectator.query<HTMLAnchorElement>(`h3#${id} > a[href="#${id}"]`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchorLink).toBeTruthy();
      expect(anchorLink?.classList.contains('section-anchor')).toBeTrue();
      expect(anchorLink?.textContent?.trim()).toBe('🔗');
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

  it('should render three InputText variants for validation, disabled and readonly', () => {
    expect(spectator.query<HTMLInputElement>('#input-text-validation')).toBeTruthy();
    expect(spectator.query<HTMLInputElement>('#input-text-required')).toBeTruthy();
    expect(spectator.query<HTMLInputElement>('#input-text-disabled')).toBeTruthy();
    expect(spectator.query<HTMLInputElement>('#input-text-readonly')).toBeTruthy();
  });

  it('should not show InputText validation error before field is touched', () => {
    expect(spectator.query('p-message')).toBeFalsy();
  });

  it('should show required validation error after InputText field is touched', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-validation');

    expect(input).toBeTruthy();
    spectator.dispatchFakeEvent(input as HTMLInputElement, 'blur');
    spectator.detectChanges();

    expect(spectator.query('p-message')).toBeTruthy();
  });

  it('should apply minlength validation to InputText and show error for too-short input', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-validation');

    expect(input?.getAttribute('minlength')).toBe('3');
    spectator.typeInElement('ab', input as HTMLInputElement);
    spectator.dispatchFakeEvent(input as HTMLInputElement, 'blur');
    spectator.detectChanges();

    expect(spectator.query('p-message')).toBeTruthy();
  });

  it('should render required InputText field with red asterisk', () => {
    const requiredLabel = spectator.query('label[for="input-text-required"]');
    const requiredInput = spectator.query<HTMLInputElement>('#input-text-required');

    expect(requiredLabel?.textContent).toContain('*');
    expect(requiredInput?.hasAttribute('required')).toBeTrue();
    expect(requiredInput?.hasAttribute('aria-required')).toBeTrue();
  });

  it('should show required validation error when required field is touched and empty', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-required');

    expect(input).toBeTruthy();
    spectator.dispatchFakeEvent(input as HTMLInputElement, 'blur');
    spectator.detectChanges();

    const errorMessage = spectator.query('p-message');
    expect(errorMessage).toBeTruthy();
  });

  it('should keep disabled and readonly InputText variants in correct state', () => {
    const disabledInput = spectator.query<HTMLInputElement>('#input-text-disabled');
    const readonlyInput = spectator.query<HTMLInputElement>('#input-text-readonly');

    expect(disabledInput?.disabled).toBeTrue();
    expect(readonlyInput?.readOnly).toBeTrue();
    expect(disabledInput?.value.length).toBeGreaterThan(0);
    expect(readonlyInput?.value.length).toBeGreaterThan(0);
  });

  it('should render Inputmask phone field with label, placeholder and help text', () => {
    const label = spectator.query<HTMLLabelElement>('label[for="input-mask-phone"]');
    const input = spectator.query<HTMLInputElement>('input#input-mask-phone');
    const helpText = spectator.query<HTMLElement>('#input-mask-phone-help');

    expect(label?.textContent).toContain('isyAngularWidgetsDemo.labels.inputMaskPhoneNumber');
    expect(input?.getAttribute('placeholder')).toBe('isyAngularWidgetsDemo.placeholders.inputMaskPhoneNumber');
    expect(helpText?.textContent).toContain('isyAngularWidgetsDemo.messages.inputMaskPhoneHelp');
  });

  it('should render prefilled InputGroup field and clear it via button', () => {
    const label = spectator.query<HTMLLabelElement>('label[for="input-group-clearable"]');
    const input = spectator.query<HTMLInputElement>('#input-group-clearable');
    const helpText = spectator.query<HTMLElement>('#input-group-help');
    const clearButton = spectator.query('p-inputgroup p-button');

    expect(label?.textContent).toContain('isyAngularWidgetsDemo.labels.inputGroupClearable');
    expect(input?.value).toBe('Max Mustermann');
    expect(input?.getAttribute('placeholder')).toBe('isyAngularWidgetsDemo.placeholders.inputGroupClearable');
    expect(helpText?.textContent).toContain('isyAngularWidgetsDemo.messages.inputGroupHelp');
    expect(clearButton).toBeTruthy();

    spectator.click(clearButton as HTMLElement);
    spectator.detectChanges();

    expect(component.inputGroupValue).toBe('');
    expect(spectator.query<HTMLInputElement>('#input-group-clearable')?.value).toBe('');
  });
});
