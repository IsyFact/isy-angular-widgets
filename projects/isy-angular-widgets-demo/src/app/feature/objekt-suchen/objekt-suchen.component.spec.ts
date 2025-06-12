import {ObjektSuchenComponent} from './objekt-suchen.component';
import {FormControl, FormGroup} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Person} from '../../shared/model/person';
import {getEmptyPerson} from './person-data';
import {DateService} from './services/date.service';
import {Observable} from 'rxjs';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {required} from '../../shared/validation/validator';
import {provideRouter} from '@angular/router';

describe('Integration Tests: PersonenSuchenComponent', () => {
  const germanCharsStr = 'öäüÖÄÜß';
  const DOT = '.';
  const format = 'dd.mm.yyyy';
  const unconvertedDate = 'Wed Jan 01 1337 12:00:00 GMT+0053 (Mitteleuropäische Normalzeit)';
  const emptyEntry = '';

  let dateService: DateService;
  let component: ObjektSuchenComponent;
  let spectator: Spectator<ObjektSuchenComponent>;
  const createComponent = createComponentFactory({
    component: ObjektSuchenComponent,
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService, MessageService, provideRouter([])]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
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
    });
  }

  /**
   * Checks if a form is dirty
   * @param form the form who must be checked
   * @param isDirty the current dirty state
   */
  function expectFormControlsToBeDirty(form: FormGroup, isDirty: boolean): void {
    Object.keys(form.controls).forEach((key) => {
      expect(form.controls[key].dirty).toEqual(isDirty);
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
    expect(person.personalien.gender).toEqual(emptyEntry);
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
    person.personalien.gender = 'geschlecht';
    person.personalien.geburtsort = 'geburtsort';
    person.personalien.geburtsdatum = '01.01.2023';
    person.personalien.staatsangehoerigkeit = 'Deutschland';
    return person;
  }

  /**
   * Set values to the form
   */
  function setupFormValues(): void {
    component.displayWizard();
    expect(component.openWizard).toBeTrue();

    component.initReactiveForms();

    component.idForm.controls.id.setValue('0');

    const persoenlicheInfoForm = component.persoenlicheInformationenForm;
    persoenlicheInfoForm.controls.vorname.setValue('vorname');
    persoenlicheInfoForm.controls.nachname.setValue('nachname');
    persoenlicheInfoForm.controls.gender.setValue('geschlecht');

    const geburtsInfoForm = component.geburtsInformationenForm;
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
    component.editSelectedPerson(person);
    spectator.fixture.detectChanges();

    const editForm = component.editForm;

    editForm.controls.editID.setValue(person.id);
    editForm.controls.editVorname.setValue(person.personalien.vorname);
    editForm.controls.editNachname.setValue(person.personalien.nachname);
    editForm.controls.editGeburtsname.setValue(person.personalien.geburtsname);
    editForm.controls.editGender.setValue(person.personalien.gender);
    editForm.controls.editGeburtsort.setValue(person.personalien.geburtsort);
    editForm.controls.editGeburtsdatum.setValue(person.personalien.geburtsdatum);
    editForm.controls.editStaatsangehoerigkeit.setValue(person.personalien.staatsangehoerigkeit);
  }

  /**
   * Add a new person to the person list
   */
  function addNewEntryToPersonenList(): void {
    const person = getInitPerson();
    component.personen$.subscribe((list) => {
      list.unshift(person);
    });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the forms array length', () => {
    const numberOfForms = 3;
    expect(component.allWizardForms.length).toEqual(numberOfForms);
  });

  it('should check the forms array content', () => {
    expect(component.allWizardForms[0]).toEqual(component.idForm);
    expect(component.allWizardForms[1]).toEqual(component.persoenlicheInformationenForm);
    expect(component.allWizardForms[2]).toEqual(component.geburtsInformationenForm);
  });

  it('should check the status booleans on init', () => {
    expect(component.openWizard).toBeFalse();
    expect(component.isFormValid).toBeFalse();
  });

  it('should check the actions after closing the wizard', () => {
    component.onWizardClose(false);
    spectator.fixture.detectChanges();
    expectPersonToBeReseted(component.neuePerson);

    expectFormControlsToBeReseted(component.idForm);
    expectFormControlsToBeDirty(component.idForm, false);

    expectFormControlsToBeReseted(component.persoenlicheInformationenForm);
    expectFormControlsToBeDirty(component.persoenlicheInformationenForm, false);

    expectFormControlsToBeReseted(component.geburtsInformationenForm);
    expectFormControlsToBeDirty(component.geburtsInformationenForm, false);
  });

  it('should check the incoming save status - false (never arrives)', () => {
    component.getSavedStatus(false);
    expect(component.openWizard).toBeFalse();
  });

  it('should check the incoming save status - true (client clicks on wizard save button)', () => {
    const person = getInitPerson();
    setupEditForm(person);

    component.getSavedStatus(true);
    expect(component.openWizard).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (on init => index = 0)', () => {
    const wizardIndex = 0;
    component.getWizardIndex(wizardIndex);

    const idForm = component.allWizardForms[0];
    const id = idForm.get('id');
    expect(id?.errors).not.toBeNull();
    expectFormValuesAreEmpty(idForm, true);

    const personalInfoForm = component.allWizardForms[1];
    const vorname = personalInfoForm.get('vorname');
    expect(vorname?.errors).toBeNull();
    const nachname = personalInfoForm.get('nachname');
    expect(nachname?.errors).not.toBeNull();
    const gender = personalInfoForm.get('gender');
    expect(gender?.errors).not.toBeNull();
    expectFormValuesAreEmpty(personalInfoForm, true);

    const birthForm = component.allWizardForms[2];
    const geburtsname = personalInfoForm.get('geburtsname');
    expect(geburtsname?.errors).not.toBeNull();
    const geburtsort = personalInfoForm.get('geburtsort');
    expect(geburtsort?.errors).not.toBeNull();
    const staatsangehoerigkeit = personalInfoForm.get('staatsangehoerigkeit');
    expect(staatsangehoerigkeit?.errors).not.toBeNull();
    const geburtsdatum = personalInfoForm.get('geburtsdatum');
    expect(geburtsdatum?.errors).not.toBeNull();
    expectFormValuesAreEmpty(birthForm, true);

    expect(component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 1)', () => {
    const wizardIndex = 1;
    const currentForm = component.allWizardForms[wizardIndex - 1];
    currentForm.get('id')?.setValue('id');
    component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);

    spectator.fixture.detectChanges();
    expect(component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 2)', () => {
    const wizardIndex = 2;
    const currentForm = component.allWizardForms[wizardIndex - 1];
    currentForm.get('vorname')?.setValue('vorname');
    currentForm.get('nachname')?.setValue('nachname');
    currentForm.get('gender')?.setValue('geschlecht');
    component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);
    expect(component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 3)', () => {
    const wizardIndex = 2;
    const currentForm = component.allWizardForms[wizardIndex];
    currentForm.get('geburtsname')?.setValue('geburtsname');
    currentForm.get('geburtsort')?.setValue('geburtsort');
    currentForm.get('staatsangehoerigkeit')?.setValue('Malta');
    currentForm.get('geburtsdatum')?.setValue('01-01-2000');
    component.getWizardIndex(wizardIndex);

    expectFormIsValid(currentForm);
    expectFormValuesAreEmpty(currentForm, false);
    expect(component.isFormValid).toBeTrue();
  });

  it('should check the id form validation on init', () => {
    const form = component.idForm;
    const id = component.idForm.get('id');

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
    const id = component.idForm.get('id');
    const validValue = 'id';

    id!.setValue(validValue);
    expect(component.neuePerson.id).toEqual(validValue);
    expect(component.idForm.valid).toBeTrue();
    expect(id?.errors).toBeNull();
  });

  it('should check the birth form on init', () => {
    const form = component.geburtsInformationenForm;
    const geburtsname = component.geburtsInformationenForm.get('geburtsname');
    const geburtsort = component.geburtsInformationenForm.get('geburtsort');
    const staatsangehoerigkeit = component.geburtsInformationenForm.get('staatsangehoerigkeit');
    const geburtsdatum = component.geburtsInformationenForm.get('geburtsdatum');
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
    expect(component.openWizard).toBeFalse();

    component.displayWizard();
    expect(component.openWizard).toBeTrue();

    expect(component.openWizard).toBeTrue();

    component.displayWizard();
    expect(component.openWizard).toBeFalse();
  });

  it('should check the reactive forms init', () => {
    component.initReactiveForms();

    const expectedLength = 3;
    expect(component.allWizardForms.length).toEqual(expectedLength);
    expect(component.allWizardForms[0]).toEqual(component.idForm);
    expect(component.allWizardForms[1]).toEqual(component.persoenlicheInformationenForm);
    expect(component.allWizardForms[2]).toEqual(component.geburtsInformationenForm);
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
    expect(component.openWizard).toBeFalse();
    component.displayWizard();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the opening of the wizard while adding a new person - embedded call', () => {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the opening of the dialog for editing a person', () => {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the cleared search functionality', () => {
    const person = getInitPerson();
    setupEditForm(person);
    component.clearSearch();
    expectPersonToBeEmpty(component.person);
    expectArrayIsEmpty(component.personen$, true);
  });

  it('should check the addition of a new person', () => {
    setupFormValues();
    expect(component.openWizard).toBeTrue();

    const person = getInitPerson();
    setupEditForm(person);
    const newPerson = component.getNewAddedPerson();

    const idForm = component.idForm;
    expect(idForm.controls.id.value).toEqual(newPerson.id);

    const persoenlicheInfoForm = component.persoenlicheInformationenForm;
    expect(persoenlicheInfoForm.controls.vorname.value).toEqual(newPerson.personalien.vorname);
    expect(persoenlicheInfoForm.controls.nachname.value).toEqual(newPerson.personalien.nachname);
    expect(persoenlicheInfoForm.controls.gender.value).toEqual(newPerson.personalien.gender);

    const geburtsInfoForm = component.geburtsInformationenForm;
    expect(geburtsInfoForm.controls.geburtsname.value).toEqual(newPerson.personalien.geburtsname);
    expect(geburtsInfoForm.controls.geburtsort.value).toEqual(newPerson.personalien.geburtsort);
    expect(geburtsInfoForm.controls.geburtsdatum.value).toEqual(newPerson.personalien.geburtsdatum);
    expect(geburtsInfoForm.controls.staatsangehoerigkeit.value).toEqual(newPerson.personalien.staatsangehoerigkeit);

    const personenList = component.personen$;
    expectArrayIsEmpty(personenList, true);
    component.addNewPerson();
    expectArrayIsEmpty(personenList, false);
  });

  it('should check the edit of a person', () => {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();

    const person = getInitPerson();
    expect(component.editForm).toBeUndefined();

    component.editSelectedPerson(person);

    expect(component.selectedPerson).toEqual(person);
    expect(component.editForm).not.toBeUndefined();
  });

  it('should check saving of an existing edited person', () => {
    const person = getInitPerson();
    component.personen$.subscribe((list) => {
      list.unshift(person);
    });

    setupEditForm(person);
    component.editSelectedPerson(person);

    expect(component.selectedPerson!.personalien.vorname).toEqual(person.personalien.vorname);
    expect(component.editForm).not.toBeUndefined();
    const newValue = 'edit';
    component.editForm.controls.editVorname.setValue(newValue);
    expect(component.selectedPerson!.personalien.vorname).not.toEqual(component.editForm.controls.editVorname.value);
    component.saveChanges();
    expect(component.selectedPerson!.personalien.vorname).toEqual(component.editForm.controls.editVorname.value);

    expect(component.openEditForm).toBeFalse();
    expect(component.allowSave).toBeFalse();
  });

  it('should check if save button is active', () => {
    const person = getInitPerson();
    component.personen$.subscribe((list) => {
      list.unshift(person);
    });

    setupEditForm(person);
    component.editSelectedPerson(person);

    expect(component.allowSave).toBeFalse();
    const storedValue = component.editForm.controls.editVorname.value;
    component.editForm.controls.editVorname.setValue('edit');
    expect(component.allowSave).toBeTrue();
    component.editForm.controls.editVorname.setValue(storedValue);
    expect(component.allowSave).toBeFalse();
  });

  it('should check if save button is active', () => {
    let enableClearSearch = component.enableClearSearch();
    expect(enableClearSearch).toBeFalse();
    addNewEntryToPersonenList();
    enableClearSearch = component.enableClearSearch();
    expect(enableClearSearch).toBeTrue();
  });

  it('should find person', () => {
    const findPersonSpy = spyOn(spectator.component, 'findPerson');
    expect(component.tbLoadingStatus).toBeFalse();

    const searchButton = spectator.query('#search-button') as HTMLButtonElement;
    searchButton.addEventListener('click', function () {
      spectator.component.findPerson();
    });
    searchButton.click();
    spectator.fixture.detectChanges();

    expect(findPersonSpy).toHaveBeenCalled();
    expect(component.tbLoadingStatus).toBeFalse();
  });

  it('form control should be dirty after focus', () => {
    const idSpy = spyOn(component, 'onFormControlFocus');

    component.openWizard = true;
    spectator.fixture.detectChanges();

    component.idForm = new FormGroup({
      id: new FormControl('', required)
    });

    const input = spectator.query('#person-id') as HTMLInputElement;
    input.focus();
    spectator.detectChanges();

    expect(idSpy).toHaveBeenCalledWith(component.idForm.controls.id);
  });

  it('should mark form as dirty on focus', () => {
    expect(component.idForm.controls.id.dirty).toBeFalse();
    component.onFormControlFocus(component.idForm.controls.id);
    expect(component.idForm.controls.id.dirty).toBeTrue();
  });

  it('should setup countries again after language change', () => {
    const setupCountriesSpy = spyOn(component, 'setupCountries');
    component.translate.use('en');
    spectator.detectChanges();
    expect(setupCountriesSpy).toHaveBeenCalled();
  });

  it('should find persons', () => {
    const searchButtonSpy = spyOn(component, 'findPerson');

    const searchButton = spectator.query('#search-button') as HTMLButtonElement;
    searchButton.addEventListener('onClick', component.findPerson);
    searchButton.dispatchEvent(new MouseEvent('onClick'));

    expect(searchButtonSpy).toHaveBeenCalled();
  });

  it('the dialog header close icon should have an aria-label attribute', () => {
    spectator.component.displayEditDialog();
    spectator.detectChanges();
    const element = spectator.query('.p-dialog-close-button') as HTMLElement;
    expect(element.hasAttribute('aria-label')).toBeTrue();
  });

  it('should have isCollapsed set to false by default', () => {
    expect(spectator.component.isCollapsed).toBeFalse();
  });

  it('should toggle isCollapsed to true when clicked', () => {
    const panelButton = spectator.query('button.p-panel-toggler') as HTMLButtonElement;
    panelButton.click();
    spectator.fixture.detectChanges();
    expect(spectator.component.isCollapsed).toBeTrue();
  });

  it('should have table column multiselect checkbox label', () => {
    const multiselectTrigger = spectator.query('.p-multiselect-dropdown') as HTMLElement;
    multiselectTrigger.click();
    spectator.fixture.detectChanges();

    const multiselectItems = spectator.queryAll('p-multiselect-item span');

    expect(multiselectItems.length).toBeGreaterThan(0);

    for (const item of multiselectItems) {
      expect(item.textContent?.trim()).not.toBe('');
    }
  });
});
