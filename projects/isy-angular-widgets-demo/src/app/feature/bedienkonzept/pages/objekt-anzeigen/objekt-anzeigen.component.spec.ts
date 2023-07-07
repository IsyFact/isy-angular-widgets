import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjektAnzeigenComponent } from './objekt-anzeigen.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BedienkonzeptModule} from '../../bedienkonzept.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('PersonBearbeitenComponent', () => {
  let component: ObjektAnzeigenComponent;
  let fixture: ComponentFixture<ObjektAnzeigenComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ ObjektAnzeigenComponent ],
      imports: [
        RouterTestingModule,
        BedienkonzeptModule,
        BrowserAnimationsModule,
        DropdownModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  /**
   * Is clicking a button
   * @param sbutton the ID of the button who must be clicked
   */
  function clickButton(sbutton: string): void {
    const button = fixture.nativeElement.querySelector(sbutton) as HTMLButtonElement;
    button.click();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjektAnzeigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the disabled state of input fields', () => {
    component.editable = false;
    expect(component.editable).toBeFalse();
    const inputNachname = fixture.nativeElement.querySelector('#nachname') as HTMLElement;
    expect(inputNachname.attributes.getNamedItem('ng-reflect-is-disabled')).toBeTruthy();
  });

  it('save and cancel button should be undefined', () => {
    const divSaveCancel = fixture.nativeElement.querySelector('#divSaveCancel') as HTMLElement;
    expect(divSaveCancel).toBeNull();
  });

  it('should set enable state to true and show save and cancel button', () => {
    component.editable = true;
    clickButton('#buttonEdit');
    fixture.detectChanges();
    expect(component.editable).toBeTrue();
    const divSaveCancel = fixture.nativeElement.querySelector('#divSaveCancel') as HTMLElement;
    expect(divSaveCancel).not.toBeNull();
    const buttonEdit = fixture.nativeElement.querySelector('#buttonEdit') as HTMLButtonElement;
    expect(buttonEdit).toBeNull();
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    expect(iNachname.disabled).toBeFalse();
  });

  it('expect the input fields to be enabled', () => {
    component.editable = true;
    clickButton('#buttonEdit');
    fixture.detectChanges();
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    expect(iNachname.disabled).toBeFalse();
  });

  it('secret fields should be null', () => {
    const divShowSecretFields = fixture.nativeElement.querySelector('#divShowSecretFields') as HTMLElement;
    expect(divShowSecretFields).toBeNull();
  });

  it('expect secret fields to be visible', () => {
    component.showSecretFields = true;
    fixture.detectChanges();
    const divShowSecretFields = fixture.nativeElement.querySelector('#divShowSecretFields') as HTMLElement;
    expect(component.showSecretFields).toBeTrue();
    expect(divShowSecretFields).not.toBeNull();
  });

  it('expect no validation error', () => {
    const savePersonalienSpy = spyOn(component, 'savePersonalien') .and. callThrough();
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    iNachname.value = 'nachname';
    iNachname.dispatchEvent(new Event('input'));
    const iVorname = fixture.nativeElement.querySelector('#vorname') as HTMLInputElement;
    iVorname.value = 'vorname';
    iVorname.dispatchEvent(new Event('input'));
    clickButton('#buttonEdit');
    fixture.detectChanges();
    clickButton('#buttonSave');
    expect(savePersonalienSpy).toHaveBeenCalled();
    expect(iNachname.value).toEqual('nachname');
    expect(iVorname.value).toEqual('vorname');
    expect(component.newNachname).toEqual('nachname');
  });

  it('expect validation error', () => {
    const savePersonalienSpy = spyOn(component, 'savePersonalien') .and. callThrough();
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    iNachname.value = 'nachname';
    iNachname.dispatchEvent(new Event('input'));
    const iVorname = fixture.nativeElement.querySelector('#vorname') as HTMLInputElement;
    iVorname.value = '';
    iVorname.dispatchEvent(new Event('input'));
    clickButton('#buttonEdit');
    fixture.detectChanges();
    clickButton('#buttonSave');
    expect(savePersonalienSpy).not.toHaveBeenCalled();
  });

  it('expect to cancel edit', () => {
    const cancelEditSpy = spyOn(component, 'cancelEdit');
    clickButton('#buttonEdit');
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    iNachname.value = 'neuer nachname';
    iNachname.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('#buttonCancel');
    expect(cancelEditSpy).toHaveBeenCalled();
  });

  it('expect to load person on cancel edit', () => {
    const loadPersonSpy = spyOn(component, 'loadPerson');
    clickButton('#buttonEdit');
    const iNachname = fixture.nativeElement.querySelector('#nachname') as HTMLInputElement;
    iNachname.value = 'neuer nachname';
    iNachname.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('#buttonCancel');
    expect(loadPersonSpy).toHaveBeenCalled();
    expect(component.person.personalData.lastName).toEqual('Mustermann');
  });

  it('expect editable to be false on tab view click', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tabview = fixture.nativeElement.querySelector('#tabview');
    tabview.click();
    tabview.index = 1;
    expect(component.editable).toBeFalse();
  });

  it('expect tab view index to be set', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tabview = fixture.nativeElement.querySelector('#tabview');
    tabview.index = 0;
    expect(tabview.index).toBe(0);
    tabview.index = 1;
    expect(tabview.index).toBe(1);
  });
});
