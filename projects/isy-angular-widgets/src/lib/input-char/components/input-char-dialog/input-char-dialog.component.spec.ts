import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharDialogComponent} from './input-char-dialog.component';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';

describe('InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const dialogDefaultWidth = '775px';
  const dialogDefaultHeight = '460px';

  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  const numberOfBases = [...new Set(sonderzeichenListe.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen))].length;
  const numberOfGroups = [...new Set(sonderzeichenListe.map(item => item.schriftzeichengruppe))].length;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent],
      imports: [
        DialogModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    component.visible = true;
    fixture.detectChanges();
  });


  const displayInputChar = (): void => {
    expect(component.visible).toBeFalse();

    component.visible = true;
    fixture.detectChanges();

    expect(component.visible).toBeTrue();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the default size', () => {
    expect(component.width).toEqual(dialogDefaultWidth);
    expect(component.height).toEqual(dialogDefaultHeight);
  });

  it('should check the closing functionality', () => {
    const onCloseSpy = spyOn(component.visibleChange, 'emit');
    expect(component.visible).toEqual(true);

    const closeDialog = true;
    component.onInnerDialogVisibilityChange(closeDialog);
    expect(onCloseSpy).toHaveBeenCalledWith(closeDialog);
  });

  it(`should show ${numberOfBases} available bases`, () => {
    expect(component).toBeTruthy();
    const baseButtons = fixture.debugElement.queryAll(By.css('#grundzeichenSelectButton .p-buttonset div'));
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  it(`should show ${numberOfGroups} available groups`, () => {
    expect(component).toBeTruthy();
    const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichenGruppeSelectButton .p-buttonset div'));
    expect(groupButtons.length).toEqual(numberOfGroups);
  });

  it('should only have all schriftzeichen active after clicking it', () => {
    displayInputChar();

    const allButton = fixture.debugElement.query(By.css('#all-chars-button'));
    allButton.nativeElement.click();
    expect(component.allCharsModel).toBeTruthy();
    expect(component.selectedGrundzeichen).toEqual('');
    expect(component.selectedSchriftzeichenGruppe).toBeFalsy();
  });

  it('should only have a base enabled active after clicking it', () => {
    displayInputChar();
    const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button button'));
    baseSelectButton.nativeElement.click();

    expect(component.allCharsModel).toBeFalsy();
    expect(component.selectedGrundzeichen).toEqual('*');
    expect(component.selectedSchriftzeichenGruppe).toBeFalsy();
  });

  it('should only have a schriftzeichengruppe enabled active after clicking it', () => {
    displayInputChar();
    const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button button'));
    schriftzeichengruppeSelectButton.nativeElement.click();

    expect(component.allCharsModel).toBeFalsy();
    expect(component.selectedGrundzeichen).toEqual('');
    expect(component.selectedSchriftzeichenGruppe).toBeTruthy();
  });

  it('should show all characters with a selected base', () => {
    displayInputChar();
    const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button button'));
    baseSelectButton.nativeElement.click();
  });

  it('should show all characters with a selected schriftzeichengruppe', () => {
    displayInputChar();

    const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button button'));
    schriftzeichengruppeSelectButton.nativeElement.click();
  });
});
