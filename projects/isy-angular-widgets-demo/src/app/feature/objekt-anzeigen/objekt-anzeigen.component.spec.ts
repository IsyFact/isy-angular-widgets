import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {By} from '@angular/platform-browser';
import {SecurityService} from '../../../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from '../../core/user/userInfoPublicService';
import {permissions} from '../../app.permission';
import {DebugElement} from '@angular/core';
import {ObjektAnzeigenModule} from './objekt-anzeigen.module';
import {MessageService} from 'primeng/api';
<<<<<<< HEAD
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ComponentFixture} from '@angular/core/testing';
=======
import {createComponentFactory, createSpyObject, Spectator} from '@ngneat/spectator';
import {ComponentFixture} from '@angular/core/testing';
import {FileUploadHandlerEvent} from 'primeng/fileupload';
>>>>>>> origin

describe('Integration Tests: ObjektAnzeigenComponent', () => {
  let userInfoService: UserInfoPublicService;
  let securityService: SecurityService;
  const inputFields: {[key: string]: DebugElement & {disabled?: boolean}} = {};

  let component: ObjektAnzeigenComponent;
  let fixture: ComponentFixture<ObjektAnzeigenComponent>;
  let debugElement: DebugElement;
  let spectator: Spectator<ObjektAnzeigenComponent>;
<<<<<<< HEAD
  const createdComponent = createComponentFactory({
=======
  const createComponent = createComponentFactory({
>>>>>>> origin
    component: ObjektAnzeigenComponent,
    imports: [
      ObjektAnzeigenModule,
      TranslateTestingModule.withTranslations('de', {
        'isyAngularWidgetsDemo.labels.optionMale': 'Männlich'
      })
    ],
    providers: [MessageService]
  });

  beforeEach(() => {
<<<<<<< HEAD
    spectator = createdComponent();
=======
    spectator = createComponent();
>>>>>>> origin

    component = spectator.component;
    fixture = spectator.fixture;
    debugElement = fixture.debugElement;

    userInfoService = new UserInfoPublicService();
    securityService = new SecurityService();

    inputFields.lastName = debugElement.query(By.css('#last-name'));
    inputFields.firstName = debugElement.query(By.css('#first-name'));
    inputFields.birthName = debugElement.query(By.css('#birth-name'));
    inputFields.birthplace = debugElement.query(By.css('#birth-place'));
    inputFields.nationality = debugElement.query(By.css('#nationality'));
    inputFields.gender = debugElement.query(By.css('p-dropdown:has(#gender) .p-inputtext'));
    inputFields.phoneNumber = debugElement.query(By.css('#phone-number'));
    inputFields.birthDate = debugElement.query(By.css('#birth-date'));
    inputFields.dateOfEntry = debugElement.query(By.css('#date-of-entry'));
    inputFields.dateOfDeparture = debugElement.query(By.css('#date-of-departure'));
    inputFields.passportExpirationDate = debugElement.query(By.css('#passport-expiration-date'));
    inputFields.creditCardNumber = debugElement.query(By.css('#credit-card-number'));
    inputFields.creditCardExpirationDate = debugElement.query(By.css('#credit-card-expiration-date'));
  });

  /**
   * Is clicking a button
   * @param sbutton the ID of the button who must be clicked
   */
  function clickButton(sbutton: string): void {
    const button = fixture.nativeElement.querySelector(sbutton) as HTMLButtonElement;
    button.click();
  }

  /**
   * Is setting up roles and permissions
   */
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
    expect(inputFields.nationality.nativeElement.value).toEqual('Deutsch');
    expect(inputFields.gender.nativeElement.innerText).toEqual('Männlich');
    expect(inputFields.phoneNumber.nativeElement.value).toEqual('');
    expect(inputFields.birthDate.nativeElement.value).toEqual('03.08.1980');
    expect(inputFields.dateOfEntry.nativeElement.value).toEqual('xx.xx.2000');
    expect(inputFields.dateOfDeparture.nativeElement.value).toEqual('xx.xx.2024');
    expect(inputFields.passportExpirationDate.nativeElement.value).toEqual('');
    expect(inputFields.creditCardNumber.nativeElement.value).toEqual('');
    expect(inputFields.creditCardExpirationDate.nativeElement.value).toEqual('');
  });

  it('should hide button group for saving changes if not in edit mode', () => {
    const saveButtonGroup = debugElement.query(By.css('#divSaveCancel'));
    expect(saveButtonGroup).toBeNull();
  });

  it('shoud enable input fields in edit mode', () => {
    clickButton('#button-edit');
    fixture.detectChanges();
    expect(inputFields.firstName.disabled).toBeFalsy();
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

  it('should not throwing a validation error', () => {
    clickButton('#button-edit');
    fixture.detectChanges();

    const invalidFields = spectator.queryAll('.ng-invalid');
<<<<<<< HEAD
    expect(invalidFields.length).toBe(0);
=======
    expect(invalidFields.length).toBe(2);
>>>>>>> origin
  });

  it('should display validation error if lastName is empty', () => {
    clickButton('#button-edit');
    fixture.detectChanges();

    inputFields.lastName.nativeElement.value = '';
    inputFields.lastName.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputFields.lastName.nativeElement.classList).toContain('ng-invalid');
  });

  it('should set tab view index', () => {
    const tabview = fixture.nativeElement.querySelector('#tab-view');
    tabview.index = 0;
    expect(tabview.index).toBe(0);
    tabview.index = 1;
    expect(tabview.index).toBe(1);
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

  it('should display the (edit, save, cancel) buttons', () => {
    expect(component.personalInfoForm.disabled).toBeTrue();

    const editButton = fixture.nativeElement.querySelector('#button-edit') as HTMLButtonElement;
    expect(editButton).not.toBeNull();

    const saveButton = fixture.nativeElement.querySelector('#button-save') as HTMLButtonElement;
    expect(saveButton).toBeNull();

    const cancelButton = fixture.nativeElement.querySelector('#button-cancel') as HTMLButtonElement;
    expect(cancelButton).toBeNull();
  });
<<<<<<< HEAD
=======

  it('should display notificatioon message if personalien have been saved', () => {
    const msg = createSpyObject(MessageService);
    msg.add({});
    component.savePersonalien();
    fixture.detectChanges();
    expect(msg.add).toHaveBeenCalled();
  });

  it('should upload file', () => {
    const fileName = 'test.txt';
    const event: FileUploadHandlerEvent = {
      files: [
        new File(['test'], 'test.txt', {
          type: 'text/plain'
        })
      ]
    };

    expect(component.personalInfoForm.get('identityDocument')?.value).not.toEqual(fileName);
    expect(component.personalInfoForm.get('identityDocument')?.disabled).toBeTrue();

    component.uploadFile(event);

    expect(component.personalInfoForm.get('identityDocument')?.value).toEqual(fileName);
    expect(component.personalInfoForm.get('identityDocument')?.disabled).toBeFalse();
  });

  it('should check the file upload HTML element', () => {
    const fileUpload = spectator.query('#identity-document') as HTMLElement;
    expect(fileUpload.innerText).toContain('Choose');
    expect(fileUpload.tagName).toContain('P-FILEUPLOAD');

    const fileUploadArray = spectator.queryAll('p-button');
    expect(fileUploadArray).not.toBeUndefined();

    const fileUploadRow = spectator.query('.p-fileupload-row');
    expect(fileUploadRow).not.toBeUndefined();
  });
>>>>>>> origin
});
