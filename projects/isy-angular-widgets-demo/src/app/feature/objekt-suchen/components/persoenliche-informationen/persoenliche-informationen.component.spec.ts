import {PersoenlicheInformationenComponent} from './persoenliche-informationen.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {markFormAsDirty} from '../../../../shared/validation/form-helper';
import {initPersoenlicheInformationenForm} from '../../forms-data';
import {getEmptyPerson} from '../../person-data';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';
import {RequiredLabelComponent} from '../required-label/required-label.component';
import {required} from '../../../../shared/validation/validator';

describe('Integration Tests: PersoenlicheInformationenComponent', () => {
  const germanCharsStr = 'öäüÖÄÜß';
  const person = getEmptyPerson();
  const formBuilder: FormBuilder = new FormBuilder();

  let component: PersoenlicheInformationenComponent;
  let spectator: Spectator<PersoenlicheInformationenComponent>;
  const createdComponent = createComponentFactory({
    component: PersoenlicheInformationenComponent,
    imports: [
      TranslateTestingModule.withTranslations('de', {
        'isyAngularWidgetsDemo.labels.vorname': 'Vorname',
        'isyAngularWidgetsDemo.labels.nachname': 'Nachname',
        'isyAngularWidgetsDemo.labels.geschlecht': 'Geschlecht'
      }),
      MockModule(ReactiveFormsModule)
    ],
    declarations: [RequiredLabelComponent],
    providers: [{provide: FormBuilder, useValue: formBuilder}]
  });

  beforeEach(() => {
    spectator = createdComponent();
    component = spectator.component;
    component.form = initPersoenlicheInformationenForm(person);
    markFormAsDirty(component.form);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the incoming form', () => {
    const form = component.form;
    expect(form.valid).toBeFalse();
    expect(form.get('vorname')!.value).toEqual(person.personalien.vorname);
    expect(form.get('nachname')!.value).toEqual(person.personalien.nachname);
    expect(form.get('geschlecht')!.value).toEqual(person.personalien.geschlecht);
  });

  it('should validate the form fields', () => {
    const invalidValue = 1;
    const formFields = ['nachname', 'geschlecht'];

    formFields.forEach((formFieldName) => {
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

  it('should validate nachname form field', () => {
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

  it('should validate vorname form field', () => {
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

  it('should validate geschlecht form field', () => {
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

  it('should validate the form', () => {
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

  it('should evaluate the HTML label text of the input fields', () => {
    const vornameLabel = spectator.query('label#vorname-label') as HTMLElement;
    expect(vornameLabel.textContent!.trim()).toEqual('Vorname');

    const nachnameLabel = spectator.query('label#nachname-label') as HTMLElement;
    expect(nachnameLabel.textContent!.trim()).toEqual('Nachname');

    const geschlechtLabel = spectator.query('label#geschlecht-label') as HTMLElement;
    expect(geschlechtLabel.textContent!.trim()).toEqual('Geschlecht');
  });

  it('form control should be dirty after focus', () => {
    const nachnameSpy = spyOn(component, 'onFormControlFocus');
    component.form.get('nachname')!.setValue('nachname');
    spectator.fixture.detectChanges();

    const input = spectator.query('#Nachname') as HTMLInputElement;
    input.focus();

    spectator.detectChanges();
    expect(component.form.controls.nachname.dirty).toBeTrue();

    expect(nachnameSpy).toHaveBeenCalledWith(component.form.controls.nachname);
  });

  it('should mark form as dirty on focus', () => {
    component.form = new FormGroup({
      nachname: new FormControl('', required)
    });
    expect(component.form.controls.nachname.dirty).toBeFalse();

    component.onFormControlFocus(component.form.controls.nachname);
    spectator.fixture.detectChanges();
    expect(component.form.controls.nachname.dirty).toBeTrue();
  });
});
