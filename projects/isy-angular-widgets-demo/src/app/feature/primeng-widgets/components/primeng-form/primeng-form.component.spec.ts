import {createComponentFactory, Spectator} from '@ngneat/spectator/vitest';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {vi} from 'vitest';
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
    'date-picker',
    'date-time-picker',
    'date-range',
    'date-time-range',
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
    scrollToAnchor: vi.fn()
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
    viewportScrollerMock.scrollToAnchor.mockClear();
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a linkable heading per widget', () => {
    const headings = spectator.queryAll<HTMLHeadingElement>('h3.section-heading');

    expect(headings).toHaveLength(widgetAnchorIds.length);

    const headingsById = new Map(headings.map((heading) => [heading.id, heading]));

    widgetAnchorIds.forEach((id) => {
      const heading = headingsById.get(id);
      const anchorLink = heading?.querySelector<HTMLAnchorElement>('a.section-anchor');

      expect(heading).toBeTruthy();
      expect(anchorLink).toBeTruthy();
      expect(anchorLink?.textContent?.trim()).toBe('🔗');
    });
  }, 15000);

  it('should render widgets in a single-column layout', () => {
    expect(spectator.queryAll('[class*="xl:col-"]')).toHaveLength(0);
    expect(spectator.queryAll('[class*="md:col-"]')).toHaveLength(0);
  });

  it('should print the currently rendered controls without read-only duplicates', () => {
    const printableForm = spectator.query('.isy-print-form');

    expect(printableForm).toBeTruthy();
    expect(spectator.queryAll('.isy-print-form .isy-print-only')).toHaveLength(0);
    expect(spectator.queryAll('.isy-print-form input').length).toBeGreaterThan(0);
  });

  it('should scroll to the fragment anchor after initialization', () => {
    fragment$.next('inputtext');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('inputtext');
  });

  it('should scroll to a widget when anchor symbol is clicked', () => {
    spectator.click('h3#inputtext > a.section-anchor');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('inputtext');
  });

  it('should not scroll when clicking only the section heading text', () => {
    spectator.click('h3#inputtext');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should delegate scrollToWidget to anchor navigation service', () => {
    const event = new MouseEvent('click');

    component.scrollToWidget(event, 'inputtext');

    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('inputtext');
  });

  it('should filter countries with partial match', () => {
    const query = 'Uni';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.startsWith('Uni'))).toBe(true);
  });

  it('should handle empty query', () => {
    const query = '';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries).toHaveLength(component.countries.length);
  });

  it('should handle query with no matching countries', () => {
    const query = 'xyz';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries).toHaveLength(0);
  });

  it('should handle case insensitive queries', () => {
    const query = 'united';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.toLowerCase().startsWith('united'))).toBe(true);
  });

  it('should handle query with mixed case', () => {
    const query = 'UniTeD';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);
    expect(component.filteredCountries.some((country) => country.name.toLowerCase().startsWith('united'))).toBe(true);
  });

  it('should handle query with special characters', () => {
    const query = 'U*ni';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries).toHaveLength(0);
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

  it('should describe InputText validation field with help text before an error is shown', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-validation');

    expect(input).toHaveAttribute('aria-describedby', 'input-text-help');
    expect(spectator.query('#input-text-validation-error')).toBeFalsy();
  });

  it('should show required validation error after InputText field is touched', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-validation');

    expect(input).toBeTruthy();
    spectator.typeInElement('a', input as HTMLInputElement);
    spectator.dispatchFakeEvent(input as HTMLInputElement, 'blur');
    spectator.detectChanges();

    expect(spectator.query('p-message')).toBeTruthy();
  });

  it('should describe InputText validation field with help text and error when an error is shown', () => {
    const input = spectator.query<HTMLInputElement>('#input-text-validation');

    spectator.typeInElement('ab', input as HTMLInputElement);
    spectator.dispatchFakeEvent(input as HTMLInputElement, 'blur');
    spectator.detectChanges();

    expect(spectator.query('#input-text-validation-error')).toBeTruthy();
    expect(input).toHaveAttribute('aria-describedby', 'input-text-help input-text-validation-error');
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
    expect(requiredInput?.hasAttribute('required')).toBe(true);
    expect(requiredInput?.hasAttribute('aria-required')).toBe(true);
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

    expect(disabledInput?.disabled).toBe(true);
    expect(readonlyInput?.readOnly).toBe(true);
    expect(disabledInput?.value.length).toBeGreaterThan(0);
    expect(readonlyInput?.value.length).toBeGreaterThan(0);
  });

  it('should render disabled textarea and dropdown examples', () => {
    expect(spectator.query<HTMLTextAreaElement>('#textarea-disabled')?.disabled).toBe(true);
    expect(spectator.query('#dropdown-input-disabled')).toBeTruthy();
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
    const helpText = spectator.query<HTMLElement>('#input-group-help');
    const clearButton = spectator.query('p-inputgroupaddon p-button');

    expect(label?.textContent).toContain('isyAngularWidgetsDemo.labels.inputGroupClearable');
    expect(component.inputGroupValue).toBe('Max Mustermann');
    expect(helpText?.textContent).toContain('isyAngularWidgetsDemo.messages.inputGroupHelp');
    expect(clearButton).toBeTruthy();

    component.clearInputGroup();
    spectator.detectChanges();

    expect(component.inputGroupValue).toBe('');
  });

  it('should render checkbox examples in horizontal and vertical fieldsets with four items each', () => {
    expect(spectator.query('.checkbox-group-horizontal')).toBeTruthy();
    expect(spectator.query('.checkbox-group-vertical')).toBeTruthy();

    const horizontalIds = [1, 2, 3, 4].map((index) => `#checkbox-horizontal-${index}`);
    const verticalIds = [1, 2, 3, 4].map((index) => `#checkbox-vertical-${index}`);

    horizontalIds.forEach((id) => {
      expect(spectator.query<HTMLInputElement>(id)).toBeTruthy();
      expect(spectator.query(`label[for="${id.slice(1)}"]`)?.textContent).toContain('checkbox');
    });

    verticalIds.forEach((id) => {
      expect(spectator.query<HTMLInputElement>(id)).toBeTruthy();
      expect(spectator.query(`label[for="${id.slice(1)}"]`)?.textContent).toContain('checkbox');
    });
  });

  it('should render radio button examples in horizontal and vertical fieldsets with four items each', () => {
    const radioGroups = [
      {container: spectator.query<HTMLElement>('.radio-group-horizontal'), idPrefix: 'radio-horizontal'},
      {container: spectator.query<HTMLElement>('.radio-group-vertical'), idPrefix: 'radio-vertical'}
    ];

    radioGroups.forEach(({container, idPrefix}) => {
      expect(container).toBeTruthy();

      const inputs = container?.querySelectorAll<HTMLInputElement>('input[type="radio"]');

      expect(inputs).toHaveLength(4);
      inputs?.forEach((input, index) => {
        const id = `${idPrefix}-${index + 1}`;

        expect(input.id).toBe(id);
        expect(container?.querySelector<HTMLLabelElement>(`label[for="${id}"]`)?.textContent).toContain('radioButton');
      });
    });
  });

  it('should render disabled radio button examples', () => {
    expect(spectator.query('.radio-group-disabled')).toBeTruthy();
    expect(spectator.query<HTMLInputElement>('#radio-disabled-1')?.disabled).toBe(true);
    expect(spectator.query<HTMLInputElement>('#radio-disabled-2')?.disabled).toBe(true);
  });

  it('should render a disabled toggle switch example', () => {
    const disabledSwitch = spectator.query<HTMLInputElement>('#inputSwitchDisabled');

    expect(disabledSwitch).toBeTruthy();
    expect(disabledSwitch?.disabled).toBe(true);
  });
});
