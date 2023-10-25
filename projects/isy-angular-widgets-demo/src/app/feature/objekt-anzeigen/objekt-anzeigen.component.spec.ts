import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {By} from '@angular/platform-browser';
import {ObjektAnzeigenModule} from './objekt-anzeigen.module';
import {MessageService} from 'primeng/api';
import {SecurityService} from '../../../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from '../../core/user/userInfoPublicService';
import data from '../../../assets/permissions.json';

describe('Integration Tests: PersonBearbeitenComponent', () => {
  let component: ObjektAnzeigenComponent;
  let fixture: ComponentFixture<ObjektAnzeigenComponent>;
  let messageService: MessageService;
  let userInfoService: UserInfoPublicService;
  let securityService: SecurityService;
  const inputFields: any = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjektAnzeigenComponent],
      imports: [
        RouterTestingModule,
        ObjektAnzeigenModule,
        BrowserAnimationsModule,
        DropdownModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('de', {
          'isyAngularWidgetsDemo.labels.optionMale': 'Männlich'
        })
      ],
      providers: [MessageService, SecurityService, UserInfoPublicService]
    }).compileComponents();

    messageService = TestBed.inject(MessageService);
    userInfoService = TestBed.inject(UserInfoPublicService);
    securityService = TestBed.inject(SecurityService);
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
    securityService.setPermissions(data);
    component.showSecretFields = true;
    fixture.detectChanges();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjektAnzeigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputFields.lastName = fixture.debugElement.query(By.css('#last-name'));
    inputFields.firstName = fixture.debugElement.query(By.css('#first-name'));
    inputFields.birthName = fixture.debugElement.query(By.css('#birth-name'));
    inputFields.birthplace = fixture.debugElement.query(By.css('#birth-place'));
    inputFields.nationality = fixture.debugElement.query(By.css('#nationality'));
    inputFields.gender = fixture.debugElement.query(By.css('p-dropdown:has(#gender) .p-inputtext'));
    inputFields.phoneNumber = fixture.debugElement.query(By.css('#phone-number'));
    inputFields.birthDate = fixture.debugElement.query(By.css('#birth-date'));
    inputFields.dateOfEntry = fixture.debugElement.query(By.css('#date-of-entry'));
  });

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
  });

  it('should hide button group for saving changes if not in edit mode', () => {
    const saveButtonGroup = fixture.debugElement.query(By.css('#divSaveCancel'));

    expect(saveButtonGroup).toBeNull();
  });

  it('shoud enable input fields in edit mode', () => {
    clickButton('#button-edit');
    fixture.detectChanges();

    expect(inputFields.firstName.disabled).toBeFalsy();
  });

  it('should hide secret fields by default', () => {
    const secretFieldsContainer = fixture.debugElement.query(By.css('#divShowSecretFields'));

    expect(secretFieldsContainer).toBeNull();
  });

  it('should set secret fields visible', () => {
    setupRolesAndPermissions();
    component.showSecretFields = securityService.checkElementPermission('secretFieldsInputSwitch');
    expect(component.showSecretFields).toBeTrue();
    fixture.detectChanges();
    const secretFieldsContainer = fixture.debugElement.query(By.css('#div-show-secret-fields'));
    expect(secretFieldsContainer).toBeTruthy();
  });

  it('should not throwing a validation error', () => {
    clickButton('#button-edit');
    fixture.detectChanges();

    const invalidFields = fixture.debugElement.queryAll(By.css('.ng-invalid'));
    expect(invalidFields.length).toBe(0);
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

  it('should show message if personalien have been saved', () => {
    const messageSpy = spyOn(messageService, 'add');
    component.savePersonalien();
    fixture.detectChanges();
    expect(messageSpy).toHaveBeenCalled();
  });
});
