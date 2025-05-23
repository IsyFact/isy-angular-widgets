import {MultiSelectButtonComponent} from './multi-select-button.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';
import {AccordionModule} from 'primeng/accordion';
import {SelectButton, SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {InputCharData, Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';

let spectator: Spectator<MultiSelectButtonComponent>;
let component: MultiSelectButtonComponent;
let fixture: ComponentFixture<MultiSelectButtonComponent>;

const charset = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(charset.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(charset.map((item) => item.schriftzeichengruppe))];

const headerStr = 'All';
const inputData: InputCharData = {Base: bases, Groups: groups};
const props = {
  dataToDisplay: inputData,
  allButtonOptionsLabel: headerStr
};

describe('Unit Tests: MultiSelectButtonComponent', () => {
  const createComponent = createComponentFactory({
    component: MultiSelectButtonComponent,
    imports: [AccordionModule, MockModule(SelectButtonModule), MockModule(FormsModule)]
  });

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    fixture = spectator.fixture;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have undefined value after all button click', () => {
    const allSelectButton = spectator.debugElement.query(By.directive(SelectButton)).componentInstance as SelectButton;
    component.value = {group: 'Base', value: 'A'};

    allSelectButton.onChange.emit();

    expect(component.value).toBeUndefined();
  });

  it('all button should be selected on init ', () => {
    expect(component.value).toBeUndefined();
  });

  const selectGroup = (group: string, basis: string): void => {
    const mockGroup = group;
    const mockValue = basis;
    component.models = {[mockGroup]: mockValue};

    component.triggerUpdate(mockGroup);
  };

  it('should always have the correct value when clicking through multiple selections', () => {
    spyOn(component, 'writeValue').and.callThrough();
    spyOn(component.valueChange, 'emit');

    bases.forEach((base: string) => {
      selectGroup('Base', base);
      expect(component.value).toEqual({group: 'Base', value: base});
      expect(component.valueChange.emit).toHaveBeenCalledWith({group: 'Base', value: base});
    });

    groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
      selectGroup('Groups', schriftzeichengruppe);
      expect(component.value).toEqual({group: 'Groups', value: schriftzeichengruppe});
      expect(component.valueChange.emit).toHaveBeenCalledWith({group: 'Groups', value: schriftzeichengruppe});
    });
  });

  it('should register onChange callback', () => {
    const onChangeSpy = jasmine.createSpy('onChangeSpy');
    component.registerOnChange(onChangeSpy);
    component.onChange('A');
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it('should register onTouched callback', () => {
    const onTouchedSpy = jasmine.createSpy('onTouchedSpy');
    component.registerOnTouched(onTouchedSpy);
    component.onTouched();
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should disable the component when setDisabledState is called with true', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });
});

describe('Integration Tests: MultiSelectButtonComponent', () => {
  const createComponent = createComponentFactory({
    component: MultiSelectButtonComponent,
    imports: [SelectButtonModule, AccordionModule, FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    fixture = spectator.fixture;
    spectator.detectChanges();
  });

  const selectOption = (groupClass: string, value: string): void => {
    const selectButton = fixture.debugElement
      .queryAll(By.css(`${groupClass} p-togglebutton`))
      .find((elem) => elem.nativeElement.textContent === value)?.nativeElement as HTMLElement;
    expect(selectButton).toBeTruthy();

    selectButton.click();
    fixture.detectChanges();
  };

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    selectOption('.charset-selectbutton--1', schriftzeichengruppe);
  };

  const selectBasis = (basis: string): void => {
    selectOption('.charset-selectbutton--0', basis);
  };

  it('should always have the correct value when clicking through multiple selections', () => {
    bases.forEach((base: string) => {
      selectBasis(base);
      expect(component.value).toEqual({group: 'Base', value: base});
    });

    groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
      selectSchriftzeichengruppe(schriftzeichengruppe);
      expect(component.value).toEqual({group: 'Groups', value: schriftzeichengruppe});
    });
  });

  bases.forEach((base: string) => {
    it(`should show 'Base' and ${base} in value with those present in input`, () => {
      selectBasis(base);
      expect(component.value?.group).toEqual('Base');
      expect(component.value?.value).toEqual(base);
    });
  });

  groups.forEach((group: Schriftzeichengruppe) => {
    it(`should show 'Groups' and ${group} in value with those present in input`, () => {
      selectSchriftzeichengruppe(group);
      expect(component.value?.group).toEqual('Groups');
      expect(component.value?.value).toEqual(group);
    });
  });

  it('should order the accordions according to input', () => {
    const baseSelectButtons = spectator.queryAll('p-accordion p-accordion-panel p-accordion-header');

    Object.keys(inputData).forEach((group, index) => {
      expect(baseSelectButtons[index].textContent).toContain(group);
    });
  });

  it('should show the correct text on select all button', () => {
    const allSelectButton = spectator.debugElement.query(By.directive(SelectButton));

    expect(allSelectButton.nativeElement.textContent).toEqual(headerStr);
  });
});
