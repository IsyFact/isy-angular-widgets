import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {ObjektSuchenComponent} from './objekt-suchen.component';
import {RouterTestingModule} from '@angular/router/testing';
import {CalendarModule} from 'primeng/calendar';
import {ResultListComponent} from '../../components/result-list/result-list.component';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SecurityModule} from '../../../../../../../isy-angular-widgets/src/lib/security/security.module';
import {SecurityService} from '../../../../../../../isy-angular-widgets/src/lib/security/security-service';
import {WizardModule} from '../../../../../../../isy-angular-widgets/src/lib/wizard/wizard.module';
import {MessageService} from 'primeng/api';
import {
  PersoenlicheInformationenComponent
} from '../../components/persoenliche-informationen/persoenliche-informationen.component';
import {ToastModule} from 'primeng/toast';
import {TOAST_SEVERITY} from '../../../../shared/model/toast';
import {Person} from '../../../../shared/model/person';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {getEmptyPerson} from './person-data';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';
import {DateService} from '../../services/date.service';
import {Observable} from 'rxjs';
import {NotificationService} from '../../../../shared/services/notification.service';
import { TranslateTestingModule } from 'ngx-translate-testing';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// for HTML tests

/* eslint-disable @typescript-eslint/no-magic-numbers */
// disabled for date conversion checks
describe('PersonenSuchenComponent', () => {
  const germanCharsStr ='öäüÖÄÜß';
  const DOT = '.';
  const format = 'dd.mm.yyyy';
  const unconvertedDate = 'Wed Jan 01 1337 12:00:00 GMT+0053 (Mitteleuropäische Normalzeit)';
  const lifetime = 100;
  const success = TOAST_SEVERITY.SUCCESS;
  const emptyEntry = '';

  let component: ObjektSuchenComponent;
  let fixture: ComponentFixture<ObjektSuchenComponent>;
  let dateService: DateService;
  let notificationService: NotificationService;

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
    Object.keys(form.controls).forEach(key => {
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
    Object.keys(form.controls).forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (checkEmpty) ? expect(form.get(key)?.value).toEqual('') : expect(form.get(key)?.value).not.toEqual('');
    });
  }

  /**
   * Checks if a person is empty
   * @param person the person who must be checked
   */
  function expectPersonToBeEmpty(person: Person): void {
    expect(person.id).toEqual(emptyEntry);
    expect(person.personalData.vorname).toEqual(emptyEntry);
    expect(person.personalData.nachname).toEqual(emptyEntry);
    expect(person.personalData.geschlecht).toEqual(emptyEntry);
    expect(person.personalData.birthName).toEqual(emptyEntry);
    expect(person.personalData.geburtsort).toEqual(emptyEntry);
    expect(person.personalData.geburtsdatum).toEqual(emptyEntry);
    expect(person.personalData.staatsangehoerigkeit).toEqual(emptyEntry);
  }

  /**
   * Check if an array is empty
   * @param array an array of persons
   * @param checkEmpty is checking if equals or not
   */
  function expectArrayIsEmpty(array:  Observable<Person[]>, checkEmpty: boolean): void {
    array.subscribe(personen => {
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
    person.personalData.vorname = 'vorname';
    person.personalData.nachname = 'nachname';
    person.personalData.birthName = 'geburtsname';
    person.personalData.geschlecht = 'geschlecht';
    person.personalData.geburtsort = 'geburtsort';
    person.personalData.geburtsdatum = '01.01.2023';
    person.personalData.staatsangehoerigkeit = 'Deutschland';
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
    persoenlicheInfoForm.controls.geschlecht.setValue('geschlecht');

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
    fixture.detectChanges();

    const editForm = component.editForm;

    editForm.controls.editID.setValue(person.id);
    editForm.controls.editVorname.setValue(person.personalData.vorname);
    editForm.controls.editNachname.setValue(person.personalData.nachname);
    editForm.controls.editGeburtsname.setValue(person.personalData.birthName);
    editForm.controls.editGeschlecht.setValue(person.personalData.geschlecht);
    editForm.controls.editGeburtsort.setValue(person.personalData.geburtsort);
    editForm.controls.editGeburtsdatum.setValue(person.personalData.geburtsdatum);
    editForm.controls.editStaatsangehoerigkeit.setValue(person.personalData.staatsangehoerigkeit);
  }

  /**
   * Add a new person to the person list
   */
  function addNewEntryToPersonenList(): void {
    const person = getInitPerson();
    component.personen$.subscribe(list => {
      list.unshift(person);
    });
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        ObjektSuchenComponent,
        ResultListComponent,
        PersoenlicheInformationenComponent
      ],
      imports: [
        RouterTestingModule,
        CalendarModule,
        TableModule,
        DropdownModule,
        SecurityModule,
        FormsModule,
        ReactiveFormsModule,
        WizardModule,
        ToastModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        PanelModule,
        DialogModule,
        TranslateTestingModule.withTranslations({})
      ],
      providers: [
        SecurityService,
        MessageService,
        DateService,
        NotificationService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjektSuchenComponent);
    component = fixture.componentInstance;
    dateService = TestBed.inject(DateService);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

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
    fixture.detectChanges();
    expectPersonToBeReseted(component.neuePerson);
    expectFormControlsToBeReseted(component.idForm);
    expectFormControlsToBeReseted(component.persoenlicheInformationenForm);
    expectFormControlsToBeReseted(component.geburtsInformationenForm);
  });

  it('should check the incoming save status - false (never arrives)', () => {
    component.getSavedStatus(false);
    expect(component.openWizard).toBeFalse();
  });

  it('should check the incoming save status - true (client clicks on wizard save button)', fakeAsync(() => {
    const person = getInitPerson();
    setupEditForm(person);

    component.getSavedStatus(true);

    const toast = fixture.nativeElement.querySelector('#notificationToast') as HTMLElement;
    const toastPosition = 'top-right';
    expect(toast.getAttribute('position')).toEqual(toastPosition);
  }));

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
    const geschlecht = personalInfoForm.get('geschlecht');
    expect(geschlecht?.errors).not.toBeNull();
    expectFormValuesAreEmpty(personalInfoForm, true);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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

    fixture.detectChanges();
    expect(component.isFormValid).toBeFalse();
  });

  it('should check the functionality on arriving wizard index (index = 2)', () => {
    const wizardIndex = 2;
    const currentForm = component.allWizardForms[wizardIndex - 1];
    currentForm.get('vorname')?.setValue('vorname');
    currentForm.get('nachname')?.setValue('nachname');
    currentForm.get('geschlecht')?.setValue('geschlecht');
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

  it('should check the inner HTML Text of the ID Input field', () => {
    component.openWizard = true;
    fixture.detectChanges();

    const idLabel = fixture.nativeElement.querySelector('label#idLabel');
    expect(idLabel.textContent).toEqual('ID*');
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

  it('should check the build of a message without lifetime', ()=> {
    const message = notificationService.buildMessage(success, success, success);
    expect(message.severity).toEqual(success);
    expect(message.summary).toEqual(success);
    expect(message.detail).toEqual(success);
    expect(message.life).toBeUndefined();
  });

  it('should check the build of a message with lifetime', ()=> {
    const message = notificationService.buildMessage(success, success, success, lifetime);
    expect(message.severity).toEqual(success);
    expect(message.summary).toEqual(success);
    expect(message.detail).toEqual(success);
    expect(message.life).toEqual(lifetime);
  });

  it('should check the opening of the wizard while adding a new person', ()=> {
    expect(component.openWizard).toBeFalse();
    component.displayWizard();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the opening of the wizard while adding a new person - embedded call', ()=> {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the opening of the dialog for editing a person', ()=> {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();
  });

  it('should check the cleared search functionality', ()=> {
    const person = getInitPerson();
    setupEditForm(person);
    component.clearSearch();
    expectPersonToBeEmpty(component.person);
    expectArrayIsEmpty(component.personen$, true);
  });

  it('should check the addition of a new person', ()=> {
    setupFormValues();
    expect(component.openWizard).toBeTrue();

    const person = getInitPerson();
    setupEditForm(person);
    const newPerson = component.getNewAddedPerson();

    const idForm = component.idForm;
    expect(idForm.controls.id.value).toEqual(newPerson.id);

    const persoenlicheInfoForm = component.persoenlicheInformationenForm;
    expect(persoenlicheInfoForm.controls.vorname.value).toEqual(newPerson.personalData.vorname);
    expect(persoenlicheInfoForm.controls.nachname.value).toEqual(newPerson.personalData.nachname);
    expect(persoenlicheInfoForm.controls.geschlecht.value).toEqual(newPerson.personalData.geschlecht);

    const geburtsInfoForm = component.geburtsInformationenForm;
    expect(geburtsInfoForm.controls.geburtsname.value).toEqual(newPerson.personalData.birthName);
    expect(geburtsInfoForm.controls.geburtsort.value).toEqual(newPerson.personalData.geburtsort);
    expect(geburtsInfoForm.controls.geburtsdatum.value).toEqual(newPerson.personalData.geburtsdatum);
    expect(geburtsInfoForm.controls.staatsangehoerigkeit.value).toEqual(newPerson.personalData.staatsangehoerigkeit);

    const personenList = component.personen$;
    expectArrayIsEmpty(personenList, true);
    component.addNewPerson();
    expectArrayIsEmpty(personenList, false);
  });

  it('should check the edit of a person', ()=> {
    expect(component.openWizard).toBeFalse();
    component.openAddNewObjectDialog();
    expect(component.openWizard).toBeTrue();

    const person = getInitPerson();
    expect(component.editForm).toBeUndefined();

    component.editSelectedPerson(person);

    expect(component.selectedPerson).toEqual(person);
    expect(component.editForm).not.toBeUndefined();
  });

  it('should check saving of an existing edited person', ()=> {
    const person = getInitPerson();
    component.personen$.subscribe(list => {
      list.unshift(person);
    });

    setupEditForm(person);
    component.editSelectedPerson(person);

    expect(component.selectedPerson!.personalData.vorname).toEqual(person.personalData.vorname);
    expect(component.editForm).not.toBeUndefined();
    const newValue = 'edit';
    component.editForm.controls.editVorname.setValue(newValue);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(component.selectedPerson!.personalData.vorname).not.toEqual(component.editForm.controls.editVorname.value);
    component.saveChanges();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(component.selectedPerson!.personalData.vorname).toEqual(component.editForm.controls.editVorname.value);

    expect(component.openEditForm).toBeFalse();
    expect(component.allowSave).toBeFalse();
  });

  it('should check if save button is active', ()=> {
    const person = getInitPerson();
    component.personen$.subscribe(list => {
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

  it('should check if save button is active', ()=> {
    let enableClearSearch = component.enableClearSearch();
    expect(enableClearSearch).toBeFalse();
    addNewEntryToPersonenList();
    enableClearSearch = component.enableClearSearch();
    expect(enableClearSearch).toBeTrue();
  });
});
