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
    imports: [MockModule(AccordionModule), MockModule(SelectButtonModule), MockModule(FormsModule)]
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

  it('should toogle only one section at once', () => {
    expect(component.activeIndices).toEqual([]);
  });

  it('should set activeIndices to an empty array when closeAllAccordionTabs is called', () => {
    component.activeIndices = [0, 1];
    component.closeAllAccordionTabs();
    expect(component.activeIndices).toEqual([]);
  });

  it('should add index to activeIndices when toggleTab is called with an element that does not contain the classes p-button or p-button-label', () => {
    const index = 0;
    const event: unknown = {target: document.createElement('div')};
    component.toggleTab(index, event as Event);
    expect(component.activeIndices).toContain(index);
  });

  it('should remove index from activeIndices when toggleTab is called with an element that is already in activeIndices and does not contain the classes p-button or p-button-label', () => {
    const index = 0;
    const event: unknown = {target: document.createElement('div')};
    component.activeIndices = [index];
    component.toggleTab(index, event as Event);
    expect(component.activeIndices).not.toContain(index);
  });

  it('should not modify activeIndices when toggleTab is called with an element that contains class p-button-label', () => {
    const index = 0;
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('p-button-label');
    const event: unknown = {target: buttonElement};
    component.activeIndices = [index];
    component.toggleTab(index, event as Event);
    expect(component.activeIndices).toEqual([index]);
  });

  it('should not modify activeIndices when toggleTab is called with an element that contains class p-button', () => {
    const index = 0;
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('p-button');
    const event: unknown = {target: buttonElement};
    component.activeIndices = [index];
    component.toggleTab(index, event as Event);
    expect(component.activeIndices).toEqual([index]);
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

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    const schriftzeichengruppeSelectButton = fixture.debugElement
      .queryAll(By.css('.charset-selectbutton--1 .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === schriftzeichengruppe)?.nativeElement as HTMLElement;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    schriftzeichengruppeSelectButton.click();
    fixture.detectChanges();
  };

  const selectBasis = (basis: string): void => {
    const basisSelectButton = fixture.debugElement
      .queryAll(By.css('.charset-selectbutton--0 .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === basis)?.nativeElement as HTMLElement;
    expect(basisSelectButton).toBeTruthy();

    basisSelectButton.click();
    fixture.detectChanges();
  };

  it('should always have only one selection when clicking through multiple selections', () => {
    bases.forEach((base: string) => {
      selectBasis(base);
      expect(fixture.debugElement.queryAll(By.css('.charset-selectbutton--0 .p-button.p-highlight')).length).toEqual(1);
      expect(
        fixture.debugElement
          .queryAll(By.css('.charset-selectbutton--0 .p-button'))
          .filter((elem) => elem.attributes['aria-checked'] === 'true').length
      ).toEqual(1);
    });

    groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
      selectSchriftzeichengruppe(schriftzeichengruppe);
      expect(fixture.debugElement.queryAll(By.css('.charset-selectbutton--1 .p-button.p-highlight')).length).toEqual(1);
      expect(
        fixture.debugElement
          .queryAll(By.css('.charset-selectbutton--1 .p-button'))
          .filter((elem) => elem.attributes['aria-checked'] === 'true').length
      ).toEqual(1);
    });
  });

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
    const baseSelectButtons = spectator.queryAll('p-accordionTab .p-accordion-header-text');

    Object.keys(inputData).forEach((group, index) => {
      expect(baseSelectButtons[index].textContent).toContain(group);
    });
  });

  it('should show the correct text on select all button', () => {
    const allSelectButton = spectator.debugElement.query(By.directive(SelectButton));

    expect(allSelectButton.nativeElement.textContent).toEqual(headerStr);
  });

  bases.forEach((base: string) => {
    it(`should only have a ${base} base enabled active after corresponding selection"`, () => {
      const allSelectButton = spectator.debugElement.query(By.css('.all-selectbutton'))
        .componentInstance as SelectButton;
      const baseSelectButton = spectator.debugElement.query(By.css('.charset-selectbutton--0'))
        .componentInstance as SelectButton;
      const groupSelectButton = spectator.debugElement.query(By.css('.charset-selectbutton--1'))
        .componentInstance as SelectButton;

      selectBasis(base);

      expect(allSelectButton.value).toBeNull();
      expect(baseSelectButton.value).toEqual(base);
      expect(groupSelectButton.value).toBeNull();
    });
  });

  groups.forEach((group: Schriftzeichengruppe) => {
    it(`should only have a ${group} group enabled active after corresponding selection"`, () => {
      const allSelectButton = spectator.debugElement.query(By.css('.all-selectbutton'))
        .componentInstance as SelectButton;
      const baseSelectButton = spectator.debugElement.query(By.css('.charset-selectbutton--0'))
        .componentInstance as SelectButton;
      const groupSelectButton = spectator.debugElement.query(By.css('.charset-selectbutton--1'))
        .componentInstance as SelectButton;

      selectSchriftzeichengruppe(group);

      expect(allSelectButton.value).toBeNull();
      expect(baseSelectButton.value).toBeNull();
      expect(groupSelectButton.value).toEqual(group);
    });
  });
});
