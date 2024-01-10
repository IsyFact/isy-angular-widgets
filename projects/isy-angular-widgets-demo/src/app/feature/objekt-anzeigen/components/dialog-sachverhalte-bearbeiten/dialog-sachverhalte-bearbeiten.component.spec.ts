import {DialogSachverhalteBearbeitenComponent} from './dialog-sachverhalte-bearbeiten.component';
import {TableModule} from 'primeng/table';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
<<<<<<< HEAD
=======
import {PersonenService} from '../../../../shared/services/personen.service';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
>>>>>>> origin

describe('Integration Tests: DialogSachverhalteBearbeitenComponent', () => {
  let component: DialogSachverhalteBearbeitenComponent;
  let spectator: Spectator<DialogSachverhalteBearbeitenComponent>;
<<<<<<< HEAD
  const createdComponent = createComponentFactory({
    component: DialogSachverhalteBearbeitenComponent,
    imports: [TableModule]
  });

  beforeEach(() => {
    spectator = createdComponent();
=======
  const createComponent = createComponentFactory({
    component: DialogSachverhalteBearbeitenComponent,
    imports: [TableModule, DialogModule, TranslateModule.forRoot(), FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
>>>>>>> origin
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

    const deleteSachverhalteButton = spectator.query('#sachverhalte-button') as HTMLButtonElement;
    deleteSachverhalteButton.addEventListener('click', function () {
      spectator.component.deleteSachverhalt('sachverhaltA');
    });
    deleteSachverhalteButton.click();
    spectator.fixture.detectChanges();

    expect(spectator.component.newSachverhalteListe).toEqual(['sachverhaltB']);
  });
});
