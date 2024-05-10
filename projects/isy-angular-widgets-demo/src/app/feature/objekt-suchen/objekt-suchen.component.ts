import {Component} from '@angular/core';
import {PersonenService} from '../../shared/services/personen.service';
import {Observable, of} from 'rxjs';
import {Person, Personalien, PersonId} from '../../shared/model/person';
import {AbstractControl, FormGroup} from '@angular/forms';
import {markFormAsDirty, markFormControlAsDirty, resetForm} from '../../shared/validation/form-helper';
import {
  initGeburtsInformationenForm,
  initIdForm,
  initObjektBearbeitenForm,
  initPersoenlicheInformationenForm
} from './forms-data';
import {getEmptyPerson, resetPerson} from './person-data';
import {TranslateService} from '@ngx-translate/core';
import {Message, MessageService} from 'primeng/api';
import {CountryMap} from './model/country';
import {DateService} from './services/date.service';
import {TOAST_SEVERITY} from '../../shared/model/toast';

const defaultWidth = 60;

@Component({
  selector: 'demo-personen-suchen',
  templateUrl: './objekt-suchen.component.html',
  styleUrls: ['./objekt-suchen.component.scss']
})
export class ObjektSuchenComponent {
  /**
   * The boolean that decides whether to open the wizard
   */
  openWizard: boolean = false;

  /**
   * The boolean that decides whether the form is valid
   */
  isFormValid: boolean = false;

  /**
   * The form for the first wizard demo screen who includes the ID of the person
   */
  idForm!: FormGroup;

  /**
   * The form for the second wizard demo screen who includes personal information of the person
   */
  persoenlicheInformationenForm!: FormGroup;

  /**
   * The form for the third wizard demo screen who includes information about the birth of a person
   */
  geburtsInformationenForm!: FormGroup;

  /**
   * The form array who includes all the forms of all wizard demo screens
   */
  allWizardForms!: FormGroup[];

  /**
   * A new person who gona be user for the storage of the form values of the wizard demo screens
   */
  neuePerson!: Person;

  /**
   * An empty person for usage inside the forms
   */
  person: Person = getEmptyPerson();

  /**
   * A list of possible nationalities
   */
  laender: string[] = [];

  /**
   * A key-value map of countries for the nationality drop down list
   */
  countryMap: CountryMap[] = [];

  /**
   * A list of persons
   */
  personen$: Observable<Person[]>;

  /**
   * The person who was selected inside the persons list
   */
  selectedPerson?: Person;

  /**
   * The boolean that decides whether the dialog for editing a person must be displayed
   */
  openEditForm: boolean = false;

  /**
   * A form for the selected person who must be edited
   */
  editForm!: FormGroup;

  /**
   * The width of the wizard who adds a new person
   */
  width: number = defaultWidth;

  /**
   * The boolean that decides whether the modal feature may be enabled
   */
  modal: boolean = true;

  /**
   * The boolean that decides if the changes can be saved (checks if person properties has changed/edited)
   */
  allowSave: boolean = false;

  /**
   * The boolean that decides if the X icon inside the popup dialog has to be displayed
   */
  displayX: boolean = true;

  /**
   * The boolean that decides if the save action terminated successfully
   */
  savedSuccessfully: boolean = false;

  /**
   * The boolean that decides the spinner display
   */
  tbLoadingStatus = false;

  //ToDo: Test for default value and on collapse
  /**
   * The boolean that decides the active state of a panel tab
   */
  isCollapsed: boolean = false;

  constructor(
    public personService: PersonenService,
    private messageService: MessageService,
    private dateService: DateService,
    public translate: TranslateService
  ) {
    this.onLanguageChange();

    this.personen$ = of([]);
    this.setupCountries();
    this.neuePerson = getEmptyPerson();

    this.initReactiveForms();
    this.subscribeToAllForms();
  }

  /**
   * Is called on input field touch
   * @param control The touched form control
   */
  onFormControlFocus(control: AbstractControl<unknown>): void {
    markFormControlAsDirty(control);
  }

  /**
   * Is called on language change
   */
  onLanguageChange(): void {
    this.translate.onLangChange.subscribe(() => {
      this.setupCountries();
    });
  }

  /**
   * Getting the country information
   */
  setupCountries(): void {
    this.translate.get('primeng.countries').subscribe((countriesMap: CountryMap[]) => {
      this.laender = countriesMap.map((item) => item.name);
      this.countryMap = [...countriesMap];
    });
  }

  /**
   * Is used for openning/closing the Wizard for adding a new person
   */
  openAddNewObjectDialog(): void {
    this.displayWizard();
  }

  /**
   * Decides whether the wizard for adding a new person is opening/closing
   */
  displayWizard(): void {
    this.openWizard = !this.openWizard;
  }

  /**
   * Decides whether the dialog for editing an existing person is opening/closing
   */
  displayEditDialog(): void {
    this.openEditForm = !this.openEditForm;
  }

  /**
   * Initializes the for the wizard needed reactive forms.
   */
  initReactiveForms(): void {
    this.idForm = initIdForm(this.neuePerson);
    this.persoenlicheInformationenForm = initPersoenlicheInformationenForm(this.neuePerson);
    this.geburtsInformationenForm = initGeburtsInformationenForm(this.neuePerson);

    this.allWizardForms = [this.idForm, this.persoenlicheInformationenForm, this.geburtsInformationenForm];
  }

  /**
   * Triggers the subscribe method for the reactive id form.
   */
  subscribeToIdForm(): void {
    this.idForm.valueChanges.subscribe((personId: PersonId) => {
      this.isFormValid = this.idForm.valid;
      if (this.idForm.valid) {
        this.neuePerson.id = personId.id;
      }
    });
  }

  /**
   * Triggers the subscribe method for the reactive persoenlicheInformationen form.
   */
  subscribeToPersoenlicheInformationenForm(): void {
    this.persoenlicheInformationenForm.valueChanges.subscribe((personalien: Personalien) => {
      this.isFormValid = this.persoenlicheInformationenForm.valid;
      if (this.persoenlicheInformationenForm.valid) {
        this.neuePerson.personalien.vorname = personalien.vorname;
        this.neuePerson.personalien.nachname = personalien.nachname;
        this.neuePerson.personalien.geschlecht = personalien.geschlecht;
      }
    });
  }

  /**
   * Triggers the subscribe method for the reactive geburtsInformationen form.
   */
  subscribeToGeburtsInformationenForm(): void {
    this.geburtsInformationenForm.valueChanges.subscribe((personalien: Personalien) => {
      this.isFormValid = this.geburtsInformationenForm.valid;
      if (this.geburtsInformationenForm.valid) {
        this.neuePerson.personalien.geburtsname = personalien.geburtsname;
        this.neuePerson.personalien.geburtsort = personalien.geburtsort;
        this.neuePerson.personalien.staatsangehoerigkeit = personalien.staatsangehoerigkeit;
        this.neuePerson.personalien.geburtsdatum = personalien.geburtsdatum;
      }
    });
  }

  /**
   * Triggers the subscribe method for all reactive forms.
   */
  subscribeToAllForms(): void {
    this.subscribeToIdForm();
    this.subscribeToPersoenlicheInformationenForm();
    this.subscribeToGeburtsInformationenForm();
  }

  /**
   * Triggered when the current index of the wizard changes.
   * @param index The actual Wizard Index
   */
  getWizardIndex(index: number): void {
    this.isFormValid = false;
    this.allWizardForms[index].updateValueAndValidity();
  }

  /**
   * Is triggered when the user clicks the 'Speichern' (save) button within the wizard.
   * @param saved The actual saved status
   */
  getSavedStatus(saved: boolean): void {
    if (saved) {
      const addedSuccessfully = this.addNewPerson();
      if (addedSuccessfully) {
        // on success, you could ...
        // ... prevent the user from closing the wizard while saving
        this.displayX = false;

        // ... set the wizard to a final state
        this.savedSuccessfully = true;

        // ... display a notification to the user
        this.addSuccessNotification();

        // ... or reset the form and hide the wizard
        this.resetAddPersonForms();
        this.openWizard = false;
      }
      // ELSE -> If the backend operation fails you can throw an error or -> Do anything else ...
    }
    // ELSE -> User closed the wizard without saving -> Do anything else
  }

  /**
   * Is used for find persons based on their properties
   */
  findPerson(): void {
    this.tbLoadingStatus = true;
    const delay = 3000;
    setTimeout(() => {
      this.personen$ =
        this.person.id !== ''
          ? this.personService.findPersonById(this.person.id)
          : this.personService.findPersonenByParameters(this.person);
      this.tbLoadingStatus = false;
    }, delay);
  }

  /**
   * Adds a new person to the existing persons list
   * @returns The information about adding a new person
   */
  addNewPerson(): boolean {
    const person = this.getNewAddedPerson();
    this.personen$.subscribe((personenList) => {
      personenList.unshift(person);
      this.selectedPerson = personenList[0];
    });
    return true;
  }

  /**
   * @returns the currently new added person
   * Is returning a new person by getting the values from the edit form
   */
  getNewAddedPerson(): Person {
    const person = getEmptyPerson();
    person.id = this.idForm.controls.id.value as string;
    person.personalien.vorname = this.persoenlicheInformationenForm.controls.vorname.value as string;
    person.personalien.nachname = this.persoenlicheInformationenForm.controls.nachname.value as string;
    person.personalien.geschlecht = this.persoenlicheInformationenForm.controls.geschlecht.value as string;
    person.personalien.geburtsname = this.geburtsInformationenForm.controls.geburtsname.value as string;
    person.personalien.geburtsort = this.geburtsInformationenForm.controls.geburtsort.value as string;
    const geburtsdatum = this.geburtsInformationenForm.controls.geburtsdatum.value as string;
    person.personalien.geburtsdatum = this.dateService.convertToGermanDateFormat(geburtsdatum);
    person.personalien.staatsangehoerigkeit = this.geburtsInformationenForm.controls.staatsangehoerigkeit
      .value as string;
    return person;
  }

  /**
   * Is adding a notification to the notification service to display a toast popup
   */
  addSuccessNotification(): void {
    const message: Message = {
      severity: TOAST_SEVERITY.SUCCESS,
      detail: this.translate.instant('toastMessages.successfullySavedFakeData') as string,
      sticky: true
    };
    this.messageService.add(message);
  }

  /**
   * Is triggered when the wizard is closed
   * @param isOpen Der momentane Anzeigestatus des Wizards
   */
  onWizardClose(isOpen: boolean): void {
    if (!isOpen) {
      resetPerson(this.person);
      this.resetAddPersonForms();
      this.messageService.clear();
    }
  }

  /**
   * Is called for editing an existing person
   * @param person The current person
   */
  editSelectedPerson(person: Person): void {
    this.selectedPerson = person;
    this.editForm = initObjektBearbeitenForm(person);
    this.editForm.valueChanges.subscribe(() => {
      this.allowSave = this.hasPersonChanges(person);
    });
    this.displayEditDialog();
  }

  /**
   * @returns if the edit form got edited
   * Checks if person values was changed (by users edit)
   * @param originalPerson The original person before change (edit)
   */
  hasPersonChanges(originalPerson: Person): boolean {
    return (
      this.editForm.controls.editID.value !== originalPerson.id ||
      this.editForm.controls.editVorname.value !== originalPerson.personalien.vorname ||
      this.editForm.controls.editNachname.value !== originalPerson.personalien.nachname ||
      this.editForm.controls.editGeschlecht.value !== originalPerson.personalien.geschlecht ||
      this.editForm.controls.editGeburtsname.value !== originalPerson.personalien.geburtsname ||
      this.editForm.controls.editGeburtsort.value !== originalPerson.personalien.geburtsort ||
      this.editForm.controls.editGeburtsdatum.value !== originalPerson.personalien.geburtsdatum ||
      this.editForm.controls.editStaatsangehoerigkeit.value !== originalPerson.personalien.staatsangehoerigkeit
    );
  }

  /**
   * Is saving the changes of a person after edit
   */
  saveChanges(): void {
    this.selectedPerson!.id = this.editForm.controls.editID.value as string;
    this.selectedPerson!.personalien.vorname = this.editForm.controls.editVorname.value as string;
    this.selectedPerson!.personalien.nachname = this.editForm.controls.editNachname.value as string;
    this.selectedPerson!.personalien.geburtsname = this.editForm.controls.editGeburtsname.value as string;
    this.selectedPerson!.personalien.geschlecht = this.editForm.controls.editGeschlecht.value as string;
    this.selectedPerson!.personalien.geburtsort = this.editForm.controls.editGeburtsort.value as string;
    const geburtsdatum = this.editForm.controls.editGeburtsdatum.value as string;
    this.selectedPerson!.personalien.geburtsdatum = this.dateService.convertToGermanDateFormat(geburtsdatum);
    this.selectedPerson!.personalien.staatsangehoerigkeit = this.editForm.controls.editStaatsangehoerigkeit
      .value as string;

    this.openEditForm = false;
    this.allowSave = false;
  }

  /**
   * @returns the information about the visibility of the clear search button
   * Enables/disables the clear search button
   */
  enableClearSearch(): boolean {
    let enable = false;
    this.personen$.subscribe((list) => {
      enable = list.length > 0;
    });
    return enable;
  }

  /**
   * Called after pressing the clear button inside the person search form
   */
  clearSearch(): void {
    this.person = getEmptyPerson();
    this.personen$ = of([]);
    if (this.editForm) {
      resetForm(this.editForm);
      markFormAsDirty(this.editForm);
    }
    this.selectedPerson = undefined;
  }

  /**
   * Reset all used forms for the addition of a new person
   */
  resetAddPersonForms(): void {
    resetForm(this.idForm);
    resetForm(this.persoenlicheInformationenForm);
    resetForm(this.geburtsInformationenForm);
  }
}
