import {fakeAsync} from '@angular/core/testing';
import {ObjektSuchenComponent} from './objekt-suchen.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormGroup} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Person} from '../../shared/model/person';
import {getEmptyPerson} from './person-data';
import {DateService} from './services/date.service';
import {Observable} from 'rxjs';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ObjektSuchenModule} from './objekt-suchen.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('Integration Tests: PersonenSuchenComponent', () => {
  const germanCharsStr = 'öäüÖÄÜß';
  const DOT = '.';
  const format = 'dd.mm.yyyy';
  const unconvertedDate = 'Wed Jan 01 1337 12:00:00 GMT+0053 (Mitteleuropäische Normalzeit)';
  const emptyEntry = '';

  let dateService: DateService;
  let spectator: Spectator<ObjektSuchenComponent>;
  const createdComponent = createComponentFactory({
    component: ObjektSuchenComponent,
    imports: [ObjektSuchenModule, TranslateModule.forRoot(), RouterTestingModule],
    providers: [TranslateService, MessageService]
  });

  beforeEach(() => {
    spectator = createdComponent();
    dateService = new DateService();
  });

  afterEach(() => spectator.fixture.destroy());

  /**
   * Checks the reset of a person
   * @param person the person who must be checked
   */
  function expectPersonToBeReseted(person: Person): void {
    const emptyPerson = getEmptyPerson();
    expect(person).toEqual(emptyPerson);
  }

  /**
   * Checks the reset of a form
   * @param form the form who must be checked
   */
  function expectFormControlsToBeReseted(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      expect(form.controls[key].value).toBeNull();
      expect(form.controls[key].dirty).toBeTrue();
    });
  }

  /**
   * Checks the validity of a form
   * @param form the form who must be checked
   */
  function expectFormIsValid(form: FormGroup): void {
    expect(form.valid).toBeTrue();
  }

  /**
   * Checks if the values of a form are empty
   * @param form the form who must be checked
   * @param checkEmpty is checking if equals or not
   */
  function expectFormValuesAreEmpty(form: FormGroup, checkEmpty: boolean): void {
    Object.keys(form.controls).forEach((key) => {
      if (checkEmpty) {
        expect(form.get(key)?.value).toEqual('');
      } else {
        expect(form.get(key)?.value).not.toEqual('');
      }
    });
  }

  /**
   * Checks if a person is empty
   * @param person the person who must be checked
   */
  function expectPersonToBeEmpty(person: Person): void {
    expect(person.id).toEqual(emptyEntry);
    expect(person.personalien.vorname).toEqual(emptyEntry);
    expect(person.personalien.nachname).toEqual(emptyEntry);
    expect(person.personalien.geschlecht).toEqual(emptyEntry);
    expect(person.personalien.geburtsname).toEqual(emptyEntry);
    expect(person.personalien.geburtsort).toEqual(emptyEntry);
    expect(person.personalien.geburtsdatum).toEqual(emptyEntry);
    expect(person.personalien.staatsangehoerigkeit).toEqual(emptyEntry);
  }

  /**
   * Check if an array is empty
   * @param array an array of persons
   * @param checkEmpty is checking if equals or not
   */
  function expectArrayIsEmpty(array: Observable<Person[]>, checkEmpty: boolean): void {
    array.subscribe((personen) => {
      if (checkEmpty) {
        expect(personen).toEqual([]);
        expect(personen.length).toEqual(0);
      }

      if (!checkEmpty) {
        expect(personen).not.toEqual([]);
        expect(personen.length).toBeGreaterThan(0);
      }
    });
  }

  /**
   * @returns an initialized person
   * Get an initialized person
   */
  function getInitPerson(): Person {
    const person = getEmptyPerson();
    person.id = '0';
    person.personalien.vorname = 'vorname';
    person.personalien.nachname = 'nachname';
    person.personalien.geburtsname = 'geburtsname';
    person.personalien.geschlecht = 'geschlecht';
    person.personalien.geburtsort = 'geburtsort';
    person.personalien.geburtsdatum = '01.01.2023';
    person.personalien.staatsangehoerigkeit = 'Deutschland';
    return person;
  }

  /**
   * Set values to the form
   */
  function setupFormValues(): void {
    spectator.component.displayWizard();
    expect(spectator.component.openWizard).toBeTrue();

    spectator.component.initReactiveForms();

    spectator.component.idForm.controls.id.setValue('0');

    const persoenlicheInfoForm = spectator.component.persoenlicheInformationenForm;
    persoenlicheInfoForm.controls.vorname.setValue('vorname');
    persoenlicheInfoForm.controls.nachname.setValue('nachname');
    persoenlicheInfoForm.controls.geschlecht.setValue('geschlecht');

    const geburtsInfoForm = spectator.component.geburtsInformationenForm;
    geburtsInfoForm.controls.geburtsname.setValue('geburtsname');
    geburtsInfoForm.controls.geburtsort.setValue('geburtsort');
    geburtsInfoForm.controls.geburtsdatum.setValue('01.01.2023');
    geburtsInfoForm.controls.staatsangehoerigkeit.setValue('Deutschland');
  }

  /**
   * Set values to the edit form
   * @param person the person where used for initializing the form
   */
  function setupEditForm(person: Person): void {
    spectator.component.editSelectedPerson(person);
    spectator.fixture.detectChanges();

    const editForm = spectator.component.editForm;

    editForm.controls.editID.setValue(person.id);
    editForm.controls.editVorname.setValue(person.personalien.vorname);
    editForm.controls.editNachname.setValue(person.personalien.nachname);
    editForm.controls.editGeburtsname.setValue(person.personalien.geburtsname);
    editForm.controls.editGeschlecht.setValue(person.personalien.geschlecht);
    editForm.controls.editGeburtsort.setValue(person.personalien.geburtsort);
    editForm.controls.editGeburtsdatum.setValue(person.personalien.geburtsdatum);
    editForm.controls.editStaatsangehoerigkeit.setValue(person.personalien.staatsangehoerigkeit);
  }

  /**
   * Add a new person to the person list
   */
  function addNewEntryToPersonenList(): void {
    const person = getInitPerson();
    spectator.component.personen$.subscribe((list) => {
      list.unshift(person);
    });
  }

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should check the forms array length', () => {
    const numberOfForms = 3;
    expect(spectator.component.allWizardForms.length).toEqual(numberOfForms);
  });

  it('should check the forms array content', () => {
    expect(spectator.component.allWizardForms[0]).toEqual(spectator.component.idForm);
    expect(spectator.component.allWizardForms[1]).toEqual(spectator.component.persoenlicheInformationenForm);
    expect(spectator.component.allWizardForms[2]).toEqual(spectator.component.geburtsInformationenForm);
  });

  it('should check the status booleans on init', () => {
    expect(spectator.component.openWizard).toBeFalse();
    expect(spectator.component.isFormValid).toBeFalse();
  });

  it('should check the actions after closing the wizard', () => {
    spectator.component.onWizardClose(false);
    spectator.fixture.detectChanges();
    expectPersonToBeReseted(spectator.component.neuePerson);
    expectFormControlsToBeReseted(spectator.component.idForm);
    expectFormControlsToBeReseted(spectator.component.persoenlicheInformationenForm);
    expectFormControlsToBeReseted(spectator.component.geburtsInformationenForm);
  });

  it('should check the incoming save status - false (never arrives)', () => {
    spectator.component.getSavedStatus(false);
    expect(spectator.component.openWizard).toBeFalse();
  });

  it('should check the incoming save status - true (client clicks on wizard save button)', fakeAsync(() => {
    const person = getInitPerson();
    setupEditForm(person);

    spectator.component.getSavedStatus(true);

    const toast = spectator.fixture.nativeElement.querySelector('#notification-toast') as HTMLElement;
    const toastPosition = 'top-right';
    expect(toast.getAttribute('position')).toEqual(toastPosition);
  }));

  it('should check the functionality on arriving wizard index (on init => index = 0)', () => {
    const wizardIndex = 0;
    spectator.component.getWizardIndex(wizardIndex);

    const idForm = spectator.component.allWizardForms[0];
    const id = idForm.get('id');
    expect(id?.errors).not.toBeNull();
    expectFormValuesAreEmpty(idForm, true);

    const personalInfoForm = spectator.component.allWizardForms[1];
    const vorname = personalInfoForm.get('vorname');
    expect(vorname?.errors).toBeNull();
    const nachname = personalInfoForm.get('nachname');
    expect(nachname?.errors).not.toBeNull();
    const geschlecht = personalInfoForm.get('geschlecht');
    expect(geschlecht?.errors).not.toBeNull();
    expectFormValuesAreEmpty(personalInfoForm, true);

    const birthForm = spectator.component.allWizardForms[2];
    const geburtsname = personalInfoForm.get('geburtsname');
    expect(geburtsname?.errors).not.toBeNull();
    const geburtsort = personalInfoForm.get('geburtsort');
    expect(geburtsort?.errors).not.toBeNull();
    const staatsangehoerigkeit = personalInfoForm.get('staatsangehoerigkeit');
    expect(staatsangehoerigkeit?.errors).not.toBeNull();
    const geburtsdatum = personalInfoForm.get('geburtsdatum');
    expect(geburtsdatum?.errors).not.toBeNull();
    expectFormValuesAreEmpty(birthForm, true);

    expect(spectator.component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 1)', () => {
    const wizardIndex = 1;
    const currentForm = spectator.component.allWizardForms[wizardIndex - 1];
    currentForm.get('id')?.setValue('id');
    spectator.component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);

    spectator.fixture.detectChanges();
    expect(spectator.component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 2)', () => {
    const wizardIndex = 2;
    const currentForm = spectator.component.allWizardForms[wizardIndex - 1];
    currentForm.get('vorname')?.setValue('vorname');
    currentForm.get('nachname')?.setValue('nachname');
    currentForm.get('geschlecht')?.setValue('geschlecht');
    spectator.component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);
    expect(spectator.component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 3)', () => {
    const wizardIndex = 2;
    const currentForm = spectator.component.allWizardForms[wizardIndex];
    currentForm.get('geburtsname')?.setValue('geburtsname');
    currentForm.get('geburtsort')?.setValue('geburtsort');
    currentForm.get('staatsangehoerigkeit')?.setValue('Malta');
    currentForm.get('geburtsdatum')?.setValue('01-01-2000');
    spectator.component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);
    expect(spectator.component.isFormValid).toBeTrue();
  });

  it('should check the id form validation on init', () => {
    const form = spectator.component.idForm;
    const id = spectator.component.idForm.get('id');

    id!.setValue('id');
    expect(id!.errors).toBeNull();
    expect(form.valid).toBeTrue();

    id!.setValue(1);
    expect(id!.errors).toBeNull();
    expect(form.valid).toBeTrue();

    id!.setValue('');
    expect(id!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    id!.setValue(' ');
    expect(id!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    id!.setValue('id');
    expect(id!.errors).toBeNull();
    expect(form.valid).toBeTrue();

    id!.setValue(germanCharsStr);
    expect(id!.errors).toBeNull();
    expect(form.valid).toBeTrue();

    id!.setValue(`${germanCharsStr}abcde12345`);
    expect(id!.errors).toBeNull();
    expect(form.valid).toBeTrue();
  });

  it('should check for the id form the values change event', () => {
    const id = spectator.component.idForm.get('id');
    const validValue = 'id';

    id!.setValue(validValue);
    expect(spectator.component.neuePerson.id).toEqual(validValue);
    expect(spectator.component.idForm.valid).toBeTrue();
    expect(id?.errors).toBeNull();
  });

  it('should check the birth form on init', () => {
    const form = spectator.component.geburtsInformationenForm;
    const geburtsname = spectator.component.geburtsInformationenForm.get('geburtsname');
    const geburtsort = spectator.component.geburtsInformationenForm.get('geburtsort');
    const staatsangehoerigkeit = spectator.component.geburtsInformationenForm.get('staatsangehoerigkeit');
    const geburtsdatum = spectator.component.geburtsInformationenForm.get('geburtsdatum');
    expect(form.valid).toBeFalse();

    expect(geburtsname!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    expect(geburtsort!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    expect(staatsangehoerigkeit!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    expect(geburtsdatum!.errors).not.toBeNull();
    expect(form.valid).toBeFalse();

    geburtsname?.setValue('geburtsname');
    expect(geburtsname!.errors).toBeNull();
    expect(form.valid).toBeFalse();

    geburtsname!.setValue(germanCharsStr);
    expect(geburtsname!.errors).toBeNull();
    expect(form.valid).toBeFalse();

    geburtsort?.setValue('geburtsort');
    expect(geburtsort!.errors).toBeNull();
    expect(form.valid).toBeFalse();

    geburtsort!.setValue(germanCharsStr);
    expect(geburtsort!.errors).toBeNull();
    expect(form.valid).toBeFalse();

    staatsangehoerigkeit?.setValue('staatsangehoerigkeit');
    expect(staatsangehoerigkeit!.errors).toBeNull();
    expect(form.valid).toBeFalse();

    geburtsdatum?.setValue('11-10-2000');
    expect(geburtsdatum!.errors).toBeNull();
    expect(form.valid).toBeTrue();
  });

  it('should check the incoming open wizard event', () => {
    expect(spectator.component.openWizard).toBeFalse();

    spectator.component.displayWizard();
    expect(spectator.component.openWizard).toBeTrue();

    expect(spectator.component.openWizard).toBeTrue();

    spectator.component.displayWizard();
    expect(spectator.component.openWizard).toBeFalse();
  });

  it('should check the inner HTML Text of the ID Input field', () => {
    spectator.component.openWizard = true;
    spectator.fixture.detectChanges();

    const idLabel = spectator.fixture.nativeElement.querySelector('label#id-label');
    expect(idLabel.textContent).toEqual('ID');
  });

  it('should check the reactive forms init', () => {
    spectator.component.initReactiveForms();

    const expectedLength = 3;
    expect(spectator.component.allWizardForms.length).toEqual(expectedLength);
    expect(spectator.component.allWizardForms[0]).toEqual(spectator.component.idForm);
    expect(spectator.component.allWizardForms[1]).toEqual(spectator.component.persoenlicheInformationenForm);
    expect(spectator.component.allWizardForms[2]).toEqual(spectator.component.geburtsInformationenForm);
  });

  it('should check the german date format', () => {
    const actual = '01.01.1337';
    const expected = dateService.convertToGermanDateFormat(unconvertedDate);
    expect(actual).toEqual(expected);

    const firstDot = expected.substring(2, 3);
    expect(firstDot).toEqual(DOT);

    const secondDot = expected.substring(5, 6);
    expect(secondDot).toEqual(DOT);

    expect(format.length).toEqual(expected.length);
  });

  it('should check the opening of the wizard while adding a new person', () => {
    expect(spectator.component.openWizard).toBeFalse();
    spectator.component.displayWizard();
    expect(spectator.component.openWizard).toBeTrue();
  });

  it('should check the opening of the wizard while adding a new person - embedded call', () => {
    expect(spectator.component.openWizard).toBeFalse();
    spectator.component.openAddNewObjectDialog();
    expect(spectator.component.openWizard).toBeTrue();
  });

  it('should check the opening of the dialog for editing a person', () => {
    expect(spectator.component.openWizard).toBeFalse();
    spectator.component.openAddNewObjectDialog();
    expect(spectator.component.openWizard).toBeTrue();
  });

  it('should check the cleared search functionality', () => {
    const person = getInitPerson();
    setupEditForm(person);
    spectator.component.clearSearch();
    expectPersonToBeEmpty(spectator.component.person);
    expectArrayIsEmpty(spectator.component.personen$, true);
  });

  it('should check the addition of a new person', () => {
    setupFormValues();
    expect(spectator.component.openWizard).toBeTrue();

    const person = getInitPerson();
    setupEditForm(person);
    const newPerson = spectator.component.getNewAddedPerson();

    const idForm = spectator.component.idForm;
    expect(idForm.controls.id.value).toEqual(newPerson.id);

    const persoenlicheInfoForm = spectator.component.persoenlicheInformationenForm;
    expect(persoenlicheInfoForm.controls.vorname.value).toEqual(newPerson.personalien.vorname);
    expect(persoenlicheInfoForm.controls.nachname.value).toEqual(newPerson.personalien.nachname);
    expect(persoenlicheInfoForm.controls.geschlecht.value).toEqual(newPerson.personalien.geschlecht);

    const geburtsInfoForm = spectator.component.geburtsInformationenForm;
    expect(geburtsInfoForm.controls.geburtsname.value).toEqual(newPerson.personalien.geburtsname);
    expect(geburtsInfoForm.controls.geburtsort.value).toEqual(newPerson.personalien.geburtsort);
    expect(geburtsInfoForm.controls.geburtsdatum.value).toEqual(newPerson.personalien.geburtsdatum);
    expect(geburtsInfoForm.controls.staatsangehoerigkeit.value).toEqual(newPerson.personalien.staatsangehoerigkeit);

    const personenList = spectator.component.personen$;
    expectArrayIsEmpty(personenList, true);
    spectator.component.addNewPerson();
    expectArrayIsEmpty(personenList, false);
  });

  it('should check the edit of a person', () => {
    expect(spectator.component.openWizard).toBeFalse();
    spectator.component.openAddNewObjectDialog();
    expect(spectator.component.openWizard).toBeTrue();

    const person = getInitPerson();
    expect(spectator.component.editForm).toBeUndefined();

    spectator.component.editSelectedPerson(person);

    expect(spectator.component.selectedPerson).toEqual(person);
    expect(spectator.component.editForm).not.toBeUndefined();
  });

  it('should check saving of an existing edited person', () => {
    const person = getInitPerson();
    spectator.component.personen$.subscribe((list) => {
      list.unshift(person);
    });

    setupEditForm(person);
    spectator.component.editSelectedPerson(person);

    expect(spectator.component.selectedPerson!.personalien.vorname).toEqual(person.personalien.vorname);
    expect(spectator.component.editForm).not.toBeUndefined();
    const newValue = 'edit';
    spectator.component.editForm.controls.editVorname.setValue(newValue);
    expect(spectator.component.selectedPerson!.personalien.vorname).not.toEqual(
      spectator.component.editForm.controls.editVorname.value
    );
    spectator.component.saveChanges();
    expect(spectator.component.selectedPerson!.personalien.vorname).toEqual(
      spectator.component.editForm.controls.editVorname.value
    );

    expect(spectator.component.openEditForm).toBeFalse();
    expect(spectator.component.allowSave).toBeFalse();
  });

  it('should check if save button is active', () => {
    const person = getInitPerson();
    spectator.component.personen$.subscribe((list) => {
      list.unshift(person);
    });

    setupEditForm(person);
    spectator.component.editSelectedPerson(person);

    expect(spectator.component.allowSave).toBeFalse();
    const storedValue = spectator.component.editForm.controls.editVorname.value;
    spectator.component.editForm.controls.editVorname.setValue('edit');
    expect(spectator.component.allowSave).toBeTrue();
    spectator.component.editForm.controls.editVorname.setValue(storedValue);
    expect(spectator.component.allowSave).toBeFalse();
  });

  it('should check if save button is active', () => {
    let enableClearSearch = spectator.component.enableClearSearch();
    expect(enableClearSearch).toBeFalse();
    addNewEntryToPersonenList();
    enableClearSearch = spectator.component.enableClearSearch();
    expect(enableClearSearch).toBeTrue();
  });
});
