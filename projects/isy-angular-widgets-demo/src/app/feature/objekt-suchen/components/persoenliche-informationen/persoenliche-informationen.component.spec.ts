import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PersoenlicheInformationenComponent} from './persoenliche-informationen.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {markFormAsDirty} from '../../../../shared/validation/form-helper';
import {By} from '@angular/platform-browser';
import {initPersoenlicheInformationenForm} from '../../forms-data';
import {getEmptyPerson} from '../../person-data';
import { TranslateTestingModule } from 'ngx-translate-testing';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// for HTML tests
describe('PersoenlicheInformationenComponent', () => {
  const germanCharsStr ='öäüÖÄÜß';
  const person = getEmptyPerson();

  let component: PersoenlicheInformationenComponent;
  let fixture: ComponentFixture<PersoenlicheInformationenComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PersoenlicheInformationenComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        TranslateTestingModule.withTranslations('de', {
          'isyAngularWidgetsDemo.labels.vorname': 'Vorname',
          'isyAngularWidgetsDemo.labels.nachname': 'Nachname',
          'isyAngularWidgetsDemo.labels.geschlecht': 'Geschlecht'
        })
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersoenlicheInformationenComponent);
    component = fixture.componentInstance;
    component.form = initPersoenlicheInformationenForm(person);
    markFormAsDirty(component.form);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the incoming form', () => {
    const form = component.form;
    expect(form.valid).toBeFalse();
    expect(form.get('vorname')!.value).toEqual(person.personalien.vorname);
    expect(form.get('nachname')!.value).toEqual(person.personalien.nachname);
    expect(form.get('geschlecht')!.value).toEqual(person.personalien.geschlecht);
  });

  it('should check the form fields validation rules', () => {
    const invalidValue = 1;
    const formFields = [
      'nachname',
      'geschlecht'
    ];

    formFields.forEach(formFieldName => {
      const field = component.form.get(formFieldName);
      expect(field!.value).toEqual(person.personalien.nachname);
      expect(field!.valid).toBeFalse();
      expect(field?.dirty).toBeTrue();

      field!.setValue(formFieldName);
      expect(field!.value).toEqual(formFieldName);
      expect(field!.valid).toBeTrue();
      expect(field?.dirty).toBeTrue();

      field!.setValue(invalidValue);
      expect(field!.value).toEqual(invalidValue);
      expect(field!.valid).toBeFalse();
      expect(field?.dirty).toBeTrue();
    });
  });

  it('should check the HTML Inputs on init', () => {
    const inputIDs = [
      'Nachname',
      'Geschlecht'
    ];
    const stateClasses = [
      'ng-untouched',
      'ng-dirty',
      'ng-invalid'
    ];

    inputIDs.forEach(id => {
      const element = fixture.debugElement.query(By.css(`#${id}`));
      stateClasses.forEach(inputClass => {
        expect(element.classes[inputClass]).toBeTrue();
      });
    });
  });

  it('check validation of nachname', () => {
    const nachnameStr = 'nachname';
    const nachnameInput = component.form.get(nachnameStr);
    expect(nachnameInput!.errors).not.toBeNull();

    nachnameInput!.setValue(1);
    expect(nachnameInput!.errors).not.toBeNull();

    nachnameInput!.setValue('');
    expect(nachnameInput!.errors).not.toBeNull();

    nachnameInput!.setValue(' ');
    expect(nachnameInput!.errors).not.toBeNull();

    nachnameInput!.setValue('!');
    expect(nachnameInput!.errors).not.toBeNull();

    nachnameInput!.setValue(nachnameStr);
    expect(nachnameInput!.errors).toBeNull();

    nachnameInput!.setValue(germanCharsStr);
    expect(nachnameInput!.errors).toBeNull();
  });

  it('check validation of vorname', () => {
    const vornameStr = 'vorname';
    const vornameInput = component.form.get(vornameStr);
    expect(vornameInput!.errors).toBeNull();

    vornameInput!.setValue(1);
    expect(vornameInput!.errors).not.toBeNull();

    vornameInput!.setValue('');
    expect(vornameInput!.errors).toBeNull();

    vornameInput!.setValue(' ');
    expect(vornameInput!.errors).not.toBeNull();

    vornameInput!.setValue('!');
    expect(vornameInput!.errors).not.toBeNull();

    vornameInput!.setValue(vornameStr);
    expect(vornameInput!.errors).toBeNull();

    vornameInput!.setValue(germanCharsStr);
    expect(vornameInput!.errors).toBeNull();
  });

  it('check validation of geschlecht', () => {
    const geschlechtStr = 'geschlecht';
    const geschlechtInput = component.form.get(geschlechtStr);
    expect(geschlechtInput!.errors).not.toBeNull();

    geschlechtInput!.setValue(1);
    expect(geschlechtInput!.errors).not.toBeNull();

    geschlechtInput!.setValue('');
    expect(geschlechtInput!.errors).not.toBeNull();

    geschlechtInput!.setValue(' ');
    expect(geschlechtInput!.errors).not.toBeNull();

    geschlechtInput!.setValue('!');
    expect(geschlechtInput!.errors).not.toBeNull();

    geschlechtInput!.setValue(geschlechtStr);
    expect(geschlechtInput!.errors).toBeNull();

    geschlechtInput!.setValue(germanCharsStr);
    expect(geschlechtInput!.errors).toBeNull();
  });

  it('check form validity', () => {
    const form = component.form;
    expect(form.valid).toBeFalse();

    const nachnameInput = component.form.get('nachname');
    const vornameInput = component.form.get('vorname');
    const geschlechtInput = component.form.get('geschlecht');

    nachnameInput!.setValue('nachname');
    expect(nachnameInput?.errors).toBeNull();
    expect(form.valid).toBeFalse();

    vornameInput!.setValue('vorname');
    expect(vornameInput?.errors).toBeNull();
    expect(form.valid).toBeFalse();

    geschlechtInput!.setValue('geschlecht');
    expect(geschlechtInput?.errors).toBeNull();
    expect(form.valid).toBeTrue();
  });

  it('should check the inner HTML Text of the Input fields', () => {
    const vornameLabel = fixture.nativeElement.querySelector('label#vorname-label');
    expect(vornameLabel.textContent.trim()).toEqual('Vorname');

    const nachnameLabel = fixture.nativeElement.querySelector('label#nachname-label');
    expect(nachnameLabel.textContent.trim()).toEqual('Nachname');

    const geschlechtLabel = fixture.nativeElement.querySelector('label#geschlecht-label');
    expect(geschlechtLabel.textContent.trim()).toEqual('Geschlecht');
  });
});
