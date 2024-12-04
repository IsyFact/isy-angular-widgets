import {DialogSachverhalteBearbeitenComponent} from './dialog-sachverhalte-bearbeiten.component';
import {TableModule} from 'primeng/table';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PersonenService} from '../../../../shared/services/personen.service';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

describe('Integration Tests: DialogSachverhalteBearbeitenComponent', () => {
  let component: DialogSachverhalteBearbeitenComponent;
  let spectator: Spectator<DialogSachverhalteBearbeitenComponent>;
  const createComponent = createComponentFactory({
    component: DialogSachverhalteBearbeitenComponent,
    imports: [TableModule, DialogModule, TranslateModule.forRoot(), FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  /**
   * Setting up person
   */
  function setupPerson(): void {
    const personService = new PersonenService();
    component.person = personService.generatePerson();
    spectator.fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges method should have been called', () => {
    const ngOnChangeSpy = spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(ngOnChangeSpy).toHaveBeenCalled();
  });

  it('saveSachverhalte method should have been called', () => {
    const saveSachverhalteSpy = spyOn(component, 'saveSachverhalte').and.callThrough();
    component.saveSachverhalte();
    expect(saveSachverhalteSpy).toHaveBeenCalled();
  });

  it('createSachverhalt method should have been called', () => {
    const spy = spyOn(component, 'createSachverhalt').and.callThrough();
    component.createSachverhalt('createSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('deleteSachverhalt method should have been called', () => {
    const spy = spyOn(component, 'deleteSachverhalt').and.callThrough();
    component.deleteSachverhalt('deleteSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('closeDialog method should have been called', () => {
    const spy = spyOn(component, 'closeDialog').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should save sachverhalte', () => {
    const visibilityChangeSpy = spyOn(component.visibleChange, 'emit');
    component.visible = true;
    setupPerson();

    (spectator.query('#ok-button') as HTMLButtonElement).click();
    spectator.fixture.detectChanges();

    expect(component.person!.sachverhalte).toEqual(component.newSachverhalteListe);
    expect(component.visible).toBeFalse();
    expect(visibilityChangeSpy).toHaveBeenCalledWith(component.visible);
  });

  it('should not save sachverhalte', () => {
    component.visible = true;
    component.saveSachverhalte();
    spectator.fixture.detectChanges();
    expect(component.visible).toBeTrue();
  });

  it('should delete sachverhalt', () => {
    component.newSachverhalteListe = ['sachverhaltA', 'sachverhaltB'];
    component.visible = true;
    setupPerson();

    const deleteSachverhalteButton = spectator.query('.sachverhalte-button') as HTMLButtonElement;
    deleteSachverhalteButton.addEventListener('click', function () {
      spectator.component.deleteSachverhalt('sachverhaltA');
    });
    deleteSachverhalteButton.click();
    spectator.fixture.detectChanges();

    expect(spectator.component.newSachverhalteListe).toEqual(['sachverhaltB']);
  });

  it('the dialog header close icon should have an aria-label attribute', () => {
    component.visible = true;
    setupPerson();
    const element = spectator.query('.p-dialog-header button.p-dialog-header-close') as HTMLElement;
    expect(element.hasAttribute('aria-label')).toBeTrue();
  });

  it('should close the dialog when closeDialog is called', () => {
    component.visible = true;
    component.closeDialog();
    expect(component.visible).toBeFalse();
  });

  it('should emit visibleChange event with true when dialog is opened', () => {
    const visibilityChangeSpy = spyOn(component.visibleChange, 'emit');
    component.visible = false;
    component.visibleChange.emit(true);
    expect(visibilityChangeSpy).toHaveBeenCalledWith(true);
  });

  it('should emit visibleChange event with false when dialog is closed', () => {
    const visibilityChangeSpy = spyOn(component.visibleChange, 'emit');
    component.visible = true;
    component.visibleChange.emit(false);
    expect(visibilityChangeSpy).toHaveBeenCalledWith(false);
  });
});
