import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {FormsModule} from '@angular/forms';
import {fileOptionData} from './data/file-option';
import {countryData} from './data/country';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

describe('PrimengWidgetsComponent', () => {
  let component: PrimengWidgetsComponent;
  let fixture: ComponentFixture<PrimengWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimengWidgetsComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial counties and filtered counties', () => {
    expect(component.countries.length).toBe(countryData.length);
    expect(component.filteredCountries.length).toBe(0);
  });

  it('should filter countries based on the given query', () => {
    let query = 'United';
    const event: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(event);
    expect(component.filteredCountries.length).toBeGreaterThan(0);

    query = 'No country';
    const noCountryEvent: AutoCompleteCompleteEvent = {query, originalEvent: new Event('')};
    component.filterCountry(noCountryEvent);
    expect(component.filteredCountries.length).toBe(0);
  });

  it('should have the correct initial values for the files array', () => {
    expect(component.files.length).toBe(fileOptionData.length);
  });

  it('should have the initial stateOptions array with two values', () => {
    expect(component.stateOptions.length).toBe(2);
  });

  it('should show dialog', () => {
    component.showDialog();
    expect(component.visibleDialog).toBeTrue();
  });

  it('should close dialog', () => {
    component.visibleDialog = true;
    component.closeDialog();
    expect(component.visibleDialog).toBeFalse();
  });

  it('should show sidebar', () => {
    component.showSidebar();
    expect(component.visibleSidebar).toBeTrue();
  });
});
