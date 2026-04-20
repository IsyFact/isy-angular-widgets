import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {By} from '@angular/platform-browser';
import {SecurityService} from '@isy-angular-widgets/security/security-service';
import {UserInfoPublicService} from '../../core/user/userInfoPublicService';
import {permissions} from '../../app.permission';
import {DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {MessageService} from 'primeng/api';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {FileUploadHandlerEvent} from 'primeng/fileupload';
import {provideHttpClient} from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  TranslateNoOpLoader,
  TranslateService,
  provideTranslateService
} from '@ngx-translate/core';

interface ObjektAnzeigenComponentTestAccess {
  lastTrigger?: HTMLElement;
}

describe('Integration Tests: ObjektAnzeigenComponent', () => {
  let userInfoService: UserInfoPublicService;
  let securityService: SecurityService;
  const inputFields: {[key: string]: DebugElement & {disabled?: boolean}} = {};

  let component: ObjektAnzeigenComponent;
  let fixture: ComponentFixture<ObjektAnzeigenComponent>;
  let debugElement: DebugElement;
  let spectator: Spectator<ObjektAnzeigenComponent>;
  const createComponent = createComponentFactory({
    component: ObjektAnzeigenComponent,
    imports: [ObjektAnzeigenComponent, TranslateModule],
    providers: [
      MessageService,
      provideHttpClient(),
      provideTranslateService(),
      {provide: TranslateLoader, useClass: TranslateNoOpLoader}
    ]
  });

  const getComponentAccess = (): ObjektAnzeigenComponentTestAccess =>
    component as unknown as ObjektAnzeigenComponentTestAccess;

  beforeEach(() => {
    spectator = createComponent();

    component = spectator.component;
    const translate = spectator.inject(TranslateService);
    translate.setTranslation(
      'de',
      {
        'isyAngularWidgetsDemo.labels.optionMale': 'Männlich',
        'isyAngularWidgetsDemo.actions.addNationality': 'Staatsangehörigkeit hinzufügen',
        'isyAngularWidgetsDemo.messages.nationalitiesHint':
          'Mindestens 1, maximal {{count}} Einträge. Aktuell: {{current}}.',
        'isyAngularWidgetsDemo.messages.nationalitiesRequired': 'Mindestens eine Staatsangehörigkeit ist erforderlich.',
        'isyAngularWidgetsDemo.messages.nationalitiesMaxReached':
          'Es können maximal {{count}} Staatsangehörigkeiten erfasst werden.'
      },
      true
    );
    translate.use('de');

    spectator.detectChanges();
    fixture = spectator.fixture;
    debugElement = fixture.debugElement;

    userInfoService = new UserInfoPublicService();
    securityService = new SecurityService();

    inputFields.lastName = debugElement.query(By.css('#last-name'));
    inputFields.firstName = debugElement.query(By.css('#first-name'));
    inputFields.birthName = debugElement.query(By.css('#birth-name'));
    inputFields.birthplace = debugElement.query(By.css('#birth-place'));
    inputFields.nationalityInput = debugElement.query(By.css('#nationality-input'));
    inputFields.gender = debugElement.query(By.css('#gender'));
    inputFields.phoneNumber = debugElement.query(By.css('#phone-number'));
    inputFields.birthDate = debugElement.query(By.css('#birth-date'));
    inputFields.dateOfEntry = debugElement.query(By.css('#date-of-entry'));
    inputFields.dateOfDeparture = debugElement.query(By.css('#date-of-departure'));
    inputFields.identityCardExpirationDate = debugElement.query(By.css('#identity-card-expiration-date'));
    inputFields.passportExpirationDate = debugElement.query(By.css('#passport-expiration-date'));
    inputFields.creditCardNumber = debugElement.query(By.css('#credit-card-number'));
    inputFields.creditCardExpirationDate = debugElement.query(By.css('#credit-card-expiration-date'));
  });

  function setupRolesAndPermissions(): void {
    const userInfoData = userInfoService.getUserInfo();
    securityService.setRoles(userInfoData);
    securityService.setPermissions(permissions);
    component.showSecretFields = true;
  }

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('should display data for Max Mustermann', async () => {
    await fixture.whenStable();

    expect(inputFields.lastName.nativeElement.value).toEqual('Mustermann');
    expect(inputFields.firstName.nativeElement.value).toEqual('Max');
    expect(inputFields.birthName.nativeElement.value.trim()).toEqual('Mustermann');
    expect(inputFields.birthplace.nativeElement.value).toEqual('Köln');
    expect(component.getNationalities().length).toBe(1);
    expect(component.getNationalities().at(0).value).toEqual('Deutsch');
    expect(inputFields.nationalityInput.nativeElement.value).toEqual('');
    expect(inputFields.gender.nativeElement.innerText).toEqual('Männlich');
    expect(inputFields.phoneNumber.nativeElement.value).toEqual('');
    expect(inputFields.birthDate.nativeElement.value).toEqual('03.08.1980');
    expect(inputFields.dateOfEntry.nativeElement.value).toEqual('xx.xx.2000');
    expect(inputFields.dateOfDeparture.nativeElement.value).toEqual('xx.xx.2024');
    expect(inputFields.identityCardExpirationDate.nativeElement.value).toEqual('');
    expect(inputFields.passportExpirationDate.nativeElement.value).toEqual('');
    expect(inputFields.creditCardNumber.nativeElement.value).toEqual('');
    expect(inputFields.creditCardExpirationDate.nativeElement.value).toEqual('');
  });

  it('should hide button group for saving changes if not in edit mode', () => {
    const saveButtonGroup = debugElement.query(By.css('#divSaveCancel'));
    expect(saveButtonGroup).toBeNull();
  });

  it('should hide secret fields by default', () => {
    const secretFieldsContainer = debugElement.query(By.css('#divShowSecretFields'));
    expect(secretFieldsContainer).toBeNull();
  });

  it('should set secret fields visible', () => {
    setupRolesAndPermissions();
    component.showSecretFields = securityService.checkElementPermission('secretFieldsInputSwitch');
    expect(component.showSecretFields).toBeTrue();
    fixture.detectChanges();
    const secretFieldsContainer = debugElement.query(By.css('#div-show-secret-fields'));
    expect(secretFieldsContainer).toBeTruthy();
  });

  it('should have show secret field label', () => {
    const secretFieldsLabel = debugElement.query(By.css('label[for="show-secret-fields"]'));
    expect(secretFieldsLabel).toBeTruthy();
    expect(secretFieldsLabel.nativeElement.textContent).not.toEqual('');
  });

  it('should have checkbox id required label', () => {
    setupRolesAndPermissions();
    component.showSecretFields = securityService.checkElementPermission('secretFieldsInputSwitch');
    fixture.detectChanges();
    const idRequiredLabel = debugElement.query(By.css('label[for="id-required"]'));
    expect(idRequiredLabel).toBeTruthy();
    expect(idRequiredLabel.nativeElement.textContent).not.toEqual('');
  });

  it('should set tab view index', () => {
    const tab = fixture.nativeElement.querySelector('p-tab');
    tab.index = 0;
    expect(tab.index).toBe(0);
    tab.index = 1;
    expect(tab.index).toBe(1);
  });

  it('should display permitted secret fields element', () => {
    expect(component.showSecretFields).toBeFalse();
    setupRolesAndPermissions();
    expect(component.showSecretFields).toBeTrue();
  });

  it('should not display non permitted element', () => {
    expect(component.showSecretFields).toBeFalse();
    const secretFields = fixture.nativeElement.querySelector('show-secret-fields');
    expect(secretFields).toBeNull();
  });

  it('should display notification message if personalien have been saved', () => {
    const messageService = spectator.inject(MessageService);
    const addSpy = spyOn(messageService, 'add');

    component.savePersonalien();
    fixture.detectChanges();

    expect(addSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        summary: jasmine.any(String),
        detail: jasmine.any(String)
      })
    );
  });

  it('should upload file', () => {
    const fileName = 'test.txt';
    const event: FileUploadHandlerEvent = {
      files: [new File(['test'], fileName, {type: 'text/plain'})]
    };

    expect(component.personalInfoForm.get('identityDocument')?.value).not.toEqual(fileName);
    component.uploadFile(event);
    expect(component.personalInfoForm.get('identityDocument')?.value).toEqual(fileName);
  });

  it('should check the file upload HTML element', () => {
    const fileUpload = spectator.query('#identity-document') as HTMLElement;
    expect(fileUpload.tagName).toContain('P-FILEUPLOAD');

    const fileUploadArray = spectator.queryAll('p-button');
    expect(fileUploadArray).not.toBeUndefined();

    const fileUploadRow = spectator.query('.p-fileupload-row');
    expect(fileUploadRow).not.toBeUndefined();
  });

  it('should add a new address to the FormArray when addNewAddress is called', () => {
    const initialLength = component.getAddresses().length;
    component.addNewAddress();
    expect(component.getAddresses().length).toBe(initialLength + 1);

    const newAddress = component.getAddresses().at(initialLength);
    expect(newAddress.get('streetName')?.value).toBe('');
    expect(newAddress.get('streetNumber')?.value).toBe('');
    expect(newAddress.get('zip')?.value).toBe('');
    expect(newAddress.get('city')?.value).toBe('');
    expect(newAddress.get('country')?.value).toBe('');
  });

  it('should return true if there is only one address', () => {
    const addresses = component.getAddresses();
    addresses.clear();
    addresses.push(component.createNewAddressFormGroup());
    expect(component.disableDeleteButton()).toBeTrue();
  });

  it('should return false if there are multiple addresses', () => {
    const addresses = component.getAddresses();
    addresses.push(component.createNewAddressFormGroup());
    expect(component.getAddresses().length).toBeGreaterThan(1);
    expect(component.disableDeleteButton()).toBeFalse();
  });

  it('should remove the address at the given index from the FormArray', () => {
    const addresses = component.getAddresses();
    addresses.push(
      component.createNewAddressFormGroup({
        street: 'Street 1',
        number: '1',
        zip: 123456,
        city: 'City A',
        country: 'Country A'
      })
    );

    addresses.push(
      component.createNewAddressFormGroup({
        street: 'Street 2',
        number: '2',
        zip: 654321,
        city: 'City B',
        country: 'Country B'
      })
    );

    const initialCount = component.getAddresses().length;
    component.removeAddress(0);
    expect(component.getAddresses().length).toBe(initialCount - 1);
    const remainingAddress = component.getAddresses().at(0).value;
    expect(remainingAddress.streetName).toEqual('Street 1');
    expect(remainingAddress.city).toEqual('City A');
  });

  it('should initialize nationalities with one required entry', () => {
    const nationalities = component.getNationalities();

    expect(nationalities.length).toBe(1);
    expect(nationalities.at(0).value).toBe('Deutsch');
    expect(component.disableRemoveNationality()).toBeTrue();
    expect(component.showNationalitiesError('minlength')).toBeFalse();
  });

  it('should add a nationality', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('Französisch');

    component.addNationality();

    expect(component.getNationalities().length).toBe(2);
    expect(component.getNationalities().at(1).value).toBe('Französisch');
    expect(component.personalInfoForm.get('nationalityInput')?.value).toBe('');
  });

  it('should add a nationality when pressing Enter in the nationality input', () => {
    const event = new KeyboardEvent('keydown', {key: 'Enter'});
    spyOn(event, 'preventDefault');

    component.personalInfoForm.get('nationalityInput')?.setValue('Spanisch');

    component.onNationalityInputKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.getNationalities().length).toBe(2);
    expect(component.getNationalities().at(1).value).toBe('Spanisch');
  });

  it('should not add an empty nationality', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('   ');

    component.addNationality();

    expect(component.getNationalities().length).toBe(1);
  });

  it('should disable add nationality if input is empty', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('');

    expect(component.disableAddNationality()).toBeTrue();
  });

  it('should disable add nationality if maximum count is reached', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('Französisch');
    component.addNationality();
    component.personalInfoForm.get('nationalityInput')?.setValue('Spanisch');
    component.addNationality();
    component.personalInfoForm.get('nationalityInput')?.setValue('Italienisch');
    component.addNationality();
    component.personalInfoForm.get('nationalityInput')?.setValue('Polnisch');
    component.addNationality();

    expect(component.getNationalities().length).toBe(component.maxNationalities);

    component.personalInfoForm.get('nationalityInput')?.setValue('Ungarisch');
    expect(component.disableAddNationality()).toBeTrue();
  });

  it('should show maxlength error if maximum count is exceeded in the form array', () => {
    const nationalities = component.getNationalities();
    nationalities.push(component['fb'].nonNullable.control('Französisch'));
    nationalities.push(component['fb'].nonNullable.control('Spanisch'));
    nationalities.push(component['fb'].nonNullable.control('Italienisch'));
    nationalities.push(component['fb'].nonNullable.control('Polnisch'));
    nationalities.push(component['fb'].nonNullable.control('Ungarisch'));
    nationalities.markAsTouched();
    nationalities.updateValueAndValidity();
    fixture.detectChanges();

    expect(nationalities.hasError('maxlength')).toBeTrue();
    expect(component.showNationalitiesError('maxlength')).toBeTrue();
  });

  it('should remove a nationality if more than one entry exists', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('Französisch');
    component.addNationality();

    expect(component.getNationalities().length).toBe(2);

    component.removeNationality(1);

    expect(component.getNationalities().length).toBe(1);
    expect(component.getNationalities().at(0).value).toBe('Deutsch');
  });

  it('should not remove the last remaining nationality', () => {
    expect(component.getNationalities().length).toBe(1);

    component.removeNationality(0);

    expect(component.getNationalities().length).toBe(1);
    expect(component.getNationalities().at(0).value).toBe('Deutsch');
  });

  it('should show required error when no nationality is available', () => {
    const nationalities = component.getNationalities();
    nationalities.clear();
    nationalities.markAsTouched();
    nationalities.updateValueAndValidity();
    fixture.detectChanges();

    expect(nationalities.hasError('minlength')).toBeTrue();
    expect(component.showNationalitiesError('minlength')).toBeTrue();
  });

  it('should build aria-describedby for nationality input based on current error state', () => {
    const nationalities = component.getNationalities();

    expect(component.getNationalitiesDescribedBy()).toContain('nationalities-help');

    nationalities.clear();
    nationalities.markAsTouched();
    nationalities.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.getNationalitiesDescribedBy()).toContain('nationalities-error-required');
  });

  it('should render nationality chips', () => {
    component.personalInfoForm.get('nationalityInput')?.setValue('Französisch');
    component.addNationality();
    fixture.detectChanges();

    const chips = spectator.queryAll('p-chip');
    expect(chips.length).toBe(2);
  });

  it('should open the character dialog when the isy-input-char button is clicked', () => {
    const button = spectator.query('.input-char-button') as HTMLButtonElement;
    spectator.click(button);
    const dialog = spectator.query('.p-dialog-mask') as HTMLElement;
    expect(dialog).toBeTruthy();
  });

  it('should not open the character dialog when pressing the enter button in the input field', () => {
    const input = spectator.query('#first-name') as HTMLButtonElement;
    spectator.dispatchKeyboardEvent(input, 'keydown', 'Enter');
    const dialog = spectator.query('.p-dialog-mask') as HTMLElement;
    expect(dialog).toBeFalsy();
  });

  it('should not open the Sachverhalt dialog by default', () => {
    const dialog = spectator.query('.p-dialog-mask') as HTMLElement;
    expect(dialog).toBeFalsy();
  });

  it('should open the Sachverhalt dialog when the edit Sachverhalt button is clicked', () => {
    const button = spectator.query('#panel-sachverhalte p-button') as HTMLElement;

    spectator.component.openDialog({
      currentTarget: button
    } as unknown as Event);

    spectator.detectChanges();

    expect(spectator.component.isDialogVisible).toBeTrue();
  });

  it('should restore focus to the last trigger when the Sachverhalt dialog is closed', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    const focusSpy = spyOn(trigger, 'focus');
    spyOnProperty(trigger, 'isConnected', 'get').and.returnValue(true);

    component.openDialog({
      currentTarget: trigger
    } as unknown as Event);

    spectator.detectChanges();
    expect(component.isDialogVisible).toBeTrue();

    component.onDialogVisibleChange(false);
    spectator.detectChanges();

    await fixture.whenStable();
    spectator.detectChanges();

    expect(component.isDialogVisible).toBeFalse();
    expect(focusSpy).toHaveBeenCalled();

    trigger.remove();
  });

  it('should not restore focus when the last trigger is not connected', async () => {
    const trigger = document.createElement('button');
    const focusSpy = spyOn(trigger, 'focus');
    spyOnProperty(trigger, 'isConnected', 'get').and.returnValue(false);

    const componentAccess = getComponentAccess();
    componentAccess.lastTrigger = trigger;

    component.onDialogVisibleChange(false);
    spectator.detectChanges();

    await fixture.whenStable();
    spectator.detectChanges();

    expect(focusSpy).not.toHaveBeenCalled();
  });
});
