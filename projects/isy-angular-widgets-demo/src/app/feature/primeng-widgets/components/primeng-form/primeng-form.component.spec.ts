import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PrimengFormComponent} from './primeng-form.component';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

describe('Unit Tests: PrimengFormComponent', () => {
  let component: PrimengFormComponent;
  let spectator: Spectator<PrimengFormComponent>;
  const createComponent = createComponentFactory({
    component: PrimengFormComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
