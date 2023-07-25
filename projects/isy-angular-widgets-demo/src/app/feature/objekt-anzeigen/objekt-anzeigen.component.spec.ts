import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {By} from '@angular/platform-browser';
import {ObjektAnzeigenModule} from './objekt-anzeigen.module';
import {MessageService} from 'primeng/api';

describe('PersonBearbeitenComponent', () => {
  let component: ObjektAnzeigenComponent;
  let fixture: ComponentFixture<ObjektAnzeigenComponent>;
  const inputFields: any = {};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ObjektAnzeigenComponent],
      imports: [
        RouterTestingModule,
        ObjektAnzeigenModule,
        BrowserAnimationsModule,
        DropdownModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('de', {
          'isyAngularWidgetsDemo.labels.optionMale': 'Männlich'
        })
      ],
      providers:
        [
          MessageService
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

    inputFields.lastName = fixture.debugElement.query(By.css('#lastName'));
    inputFields.firstName = fixture.debugElement.query(By.css('#firstName'));
    inputFields.birthName = fixture.debugElement.query(By.css('#birthName'));
    inputFields.birthplace = fixture.debugElement.query(By.css('#birthplace'));
    inputFields.nationality = fixture.debugElement.query(By.css('#nationality'));
    inputFields.gender = fixture.debugElement.query(By.css('#gender'));
    inputFields.phoneNumber = fixture.debugElement.query(By.css('#phoneNumber'));
    inputFields.birthDate = fixture.debugElement.query(By.css('#birthDate input'));
    inputFields.dateOfEntry = fixture.debugElement.query(By.css('#dateOfEntry input'));
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('displays data for Max Mustermann', async() => {
    await fixture.whenStable();

    expect(inputFields.lastName.nativeElement.value).toEqual('Mustermann');
    expect(inputFields.firstName.nativeElement.value).toEqual('Max');
    expect(inputFields.birthName.nativeElement.value.trim()).toEqual('Mustermann');
    expect(inputFields.birthplace.nativeElement.value).toEqual('Köln');
    expect(inputFields.nationality.nativeElement.value).toEqual('Deutsch');
    expect(inputFields.gender.nativeElement.innerText).toEqual('Männlich');
    expect(inputFields.phoneNumber.nativeElement.value).toBeUndefined();
    expect(inputFields.birthDate.nativeElement.value).toEqual('03.08.1980');
    expect(inputFields.dateOfEntry.nativeElement.value).toEqual('XX.XX.2000');
  });


  it('hides button group for saving changes if not in edit mode', () => {
    const saveButtonGroup = fixture.debugElement.query(By.css('#divSaveCancel'));

    expect(saveButtonGroup).toBeNull();
  });

  it('enables input fields in edit mode', () => {
    clickButton('#buttonEdit');
    fixture.detectChanges();

    expect(inputFields.firstName.disabled).toBeFalsy();
  });

  it('hides secret fields by default', () => {
    const secretFieldsContainer = fixture.debugElement.query(By.css('#divShowSecretFields'));

    expect(secretFieldsContainer).toBeNull();
  });

  it('expect secret fields to be visible', () => {
    const showSecretFieldSwitch = fixture.debugElement.query(By.css('#showSecretFields input'));

    showSecretFieldSwitch.nativeElement.checked = true;
    showSecretFieldSwitch.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const secretFieldsContainer = fixture.debugElement.query(By.css('#divShowSecretFields'));
    expect(secretFieldsContainer).toBeTruthy();
  });

  it('expect no validation error', () => {
    clickButton('#buttonEdit');
    fixture.detectChanges();

    const invalidFields = fixture.debugElement.queryAll(By.css('.ng-invalid'));

    expect(invalidFields.length).toBe(0);
  });

  it('displays validation error if lastName is empty', () => {
    clickButton('#buttonEdit');
    fixture.detectChanges();

    inputFields.lastName.nativeElement.value = '';
    inputFields.lastName.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputFields.lastName.nativeElement.classList).toContain('ng-invalid');
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
