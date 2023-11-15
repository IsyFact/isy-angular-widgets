import {PersoenlicheInformationenComponent} from './persoenliche-informationen.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {markFormAsDirty} from '../../../../shared/validation/form-helper';
import {By} from '@angular/platform-browser';
import {initPersoenlicheInformationenForm} from '../../forms-data';
import {getEmptyPerson} from '../../person-data';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';

describe('Integration Tests: PersoenlicheInformationenComponent', () => {
  const germanCharsStr = 'öäüÖÄÜß';
  const person = getEmptyPerson();
  const inputIDs = ['Nachname', 'Geschlecht'];
  const stateClasses = ['ng-untouched', 'ng-dirty', 'ng-invalid'];
  const formBuilder: FormBuilder = new FormBuilder();

  let spectator: Spectator<PersoenlicheInformationenComponent>;
  const createdComponent = createComponentFactory({
    component: PersoenlicheInformationenComponent,
    imports: [  TranslateTestingModule.withTranslations('de', {
      'isyAngularWidgetsDemo.labels.vorname': 'Vorname',
      'isyAngularWidgetsDemo.labels.nachname': 'Nachname',
      'isyAngularWidgetsDemo.labels.geschlecht': 'Geschlecht'
    }), MockModule(ReactiveFormsModule)],
    providers: [{provide: FormBuilder, useValue: formBuilder}]
  });

  beforeEach(()=> {
    spectator = createdComponent();
    spectator.component.form = initPersoenlicheInformationenForm(person);
    markFormAsDirty(spectator.component.form);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should validate the incoming form', () => {
    const form = spectator.component.form;
    expect(form.valid).toBeFalse();
    expect(form.get('vorname')!.value).toEqual(person.personalien.vorname);
    expect(form.get('nachname')!.value).toEqual(person.personalien.nachname);
    expect(form.get('geschlecht')!.value).toEqual(person.personalien.geschlecht);
  });

  it('should validate the form fields', () => {
    const invalidValue = 1;
    const formFields = ['nachname', 'geschlecht'];

    formFields.forEach((formFieldName) => {
      const field = spectator.component.form.get(formFieldName);
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
    const nachnameInput = spectator.component.form.get(nachnameStr);
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
    const vornameInput = spectator.component.form.get(vornameStr);
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
    const geschlechtInput = spectator.component.form.get(geschlechtStr);
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
    const form = spectator.component.form;
    expect(form.valid).toBeFalse();

    const nachnameInput = spectator.component.form.get('nachname');
    const vornameInput = spectator.component.form.get('vorname');
    const geschlechtInput = spectator.component.form.get('geschlecht');

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
    const vornameLabel = spectator.fixture.nativeElement.querySelector('label#vorname-label');
    expect(vornameLabel.textContent.trim()).toEqual('Vorname');

    const nachnameLabel = spectator.fixture.nativeElement.querySelector('label#nachname-label');
    expect(nachnameLabel.textContent.trim()).toEqual('Nachname');

    const geschlechtLabel = spectator.fixture.nativeElement.querySelector('label#geschlecht-label');
    expect(geschlechtLabel.textContent.trim()).toEqual('Geschlecht');
  });

  // inputIDs.forEach((id) => {
  //   stateClasses.forEach((inputClass) => {
  //     console.log(inputClass);
  //     describe(`required form input element with id: ${id}`, () => {
  //       it('should display dirty state error class', () => {
  //         console.log(spectator.fixture.debugElement.query(By.css(`#${id}`)));
  //         const element = spectator.fixture.debugElement.query(By.css(`#${id}`));
  //         expect(element.classes[inputClass]).toBeTrue();
  //       });
  //     });
  //   });
  // });
});
