import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {By} from '@angular/platform-browser';
import {SecurityService} from '../../../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from '../../core/user/userInfoPublicService';
import {permissions} from '../../app.permission';
import {DebugElement} from '@angular/core';
import {ObjektAnzeigenModule} from './objekt-anzeigen.module';
import {MessageService} from 'primeng/api';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: PersonBearbeitenComponent', () => {
  let userInfoService: UserInfoPublicService;
  let securityService: SecurityService;
  const inputFields: {[key: string]: DebugElement & {disabled?: boolean}} = {};

  let spectator: Spectator<ObjektAnzeigenComponent>;
  const createdComponent = createComponentFactory({
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
    spectator = createdComponent();
    userInfoService = new UserInfoPublicService();
    securityService = new SecurityService();

    inputFields.lastName = spectator.fixture.debugElement.query(By.css('#last-name'));
    inputFields.firstName = spectator.fixture.debugElement.query(By.css('#first-name'));
    inputFields.birthName = spectator.fixture.debugElement.query(By.css('#birth-name'));
    inputFields.birthplace = spectator.fixture.debugElement.query(By.css('#birth-place'));
    inputFields.nationality = spectator.fixture.debugElement.query(By.css('#nationality'));
    inputFields.gender = spectator.fixture.debugElement.query(By.css('p-dropdown:has(#gender) .p-inputtext'));
    inputFields.phoneNumber = spectator.fixture.debugElement.query(By.css('#phone-number'));
    inputFields.birthDate = spectator.fixture.debugElement.query(By.css('#birth-date'));
    inputFields.dateOfEntry = spectator.fixture.debugElement.query(By.css('#date-of-entry'));
    inputFields.dateOfDeparture = spectator.fixture.debugElement.query(By.css('#date-of-departure'));
    inputFields.passportExpirationDate = spectator.fixture.debugElement.query(By.css('#passport-expiration-date'));
    inputFields.creditCardNumber = spectator.fixture.debugElement.query(By.css('#credit-card-number'));
    inputFields.creditCardExpirationDate = spectator.fixture.debugElement.query(By.css('#credit-card-expiration-date'));
  });

  /**
   * Is clicking a button
   * @param sbutton the ID of the button who must be clicked
   */
  function clickButton(sbutton: string): void {
    const button = spectator.fixture.nativeElement.querySelector(sbutton) as HTMLButtonElement;
    button.click();
  }

  /**
   * Is setting up roles and permissions
   */
  function setupRolesAndPermissions(): void {
    const userInfoData = userInfoService.getUserInfo();
    securityService.setRoles(userInfoData);
    securityService.setPermissions(permissions);
    spectator.component.showSecretFields = true;
  }

  it('creates', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display data for Max Mustermann', async () => {
    await spectator.fixture.whenStable();

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
    const saveButtonGroup = spectator.fixture.debugElement.query(By.css('#divSaveCancel'));
    expect(saveButtonGroup).toBeNull();
  });

  it('shoud enable input fields in edit mode', () => {
    clickButton('#button-edit');
    spectator.fixture.detectChanges();
    expect(inputFields.firstName.disabled).toBeFalsy();
  });

  it('should hide secret fields by default', () => {
    const secretFieldsContainer = spectator.fixture.debugElement.query(By.css('#divShowSecretFields'));
    expect(secretFieldsContainer).toBeNull();
  });

  it('should set secret fields visible', () => {
    setupRolesAndPermissions();
    spectator.component.showSecretFields = securityService.checkElementPermission('secretFieldsInputSwitch');
    expect(spectator.component.showSecretFields).toBeTrue();
    spectator.fixture.detectChanges();
    const secretFieldsContainer = spectator.fixture.debugElement.query(By.css('#div-show-secret-fields'));
    expect(secretFieldsContainer).toBeTruthy();
  });

  it('should not throwing a validation error', () => {
    clickButton('#button-edit');
    spectator.fixture.detectChanges();

    const invalidFields = spectator.fixture.debugElement.queryAll(By.css('.ng-invalid'));
    expect(invalidFields.length).toBe(0);
  });

  it('should display validation error if lastName is empty', () => {
    clickButton('#button-edit');
    spectator.fixture.detectChanges();

    inputFields.lastName.nativeElement.value = '';
    inputFields.lastName.nativeElement.dispatchEvent(new Event('input'));
    spectator.fixture.detectChanges();

    expect(inputFields.lastName.nativeElement.classList).toContain('ng-invalid');
  });

  it('should set tab view index', () => {
    const tabview = spectator.fixture.nativeElement.querySelector('#tab-view');
    tabview.index = 0;
    expect(tabview.index).toBe(0);
    tabview.index = 1;
    expect(tabview.index).toBe(1);
  });

  it('should display permitted secret fields element', () => {
    expect(spectator.component.showSecretFields).toBeFalse();
    setupRolesAndPermissions();
    expect(spectator.component.showSecretFields).toBeTrue();
  });

  it('should not display non permitted element', () => {
    expect(spectator.component.showSecretFields).toBeFalse();
    const secretFields = spectator.fixture.nativeElement.querySelector('show-secret-fields');
    expect(secretFields).toBeNull();
  });

  it('should display the (edit, save, cancel) buttons', () => {
    expect(spectator.component.personalInfoForm.disabled).toBeTrue();

    const editButton = spectator.fixture.nativeElement.querySelector('#button-edit') as HTMLButtonElement;
    expect(editButton).not.toBeNull();

    const saveButton = spectator.fixture.nativeElement.querySelector('#button-save') as HTMLButtonElement;
    expect(saveButton).toBeNull();

    const cancelButton = spectator.fixture.nativeElement.querySelector('#button-cancel') as HTMLButtonElement;
    expect(cancelButton).toBeNull();
  });
});
