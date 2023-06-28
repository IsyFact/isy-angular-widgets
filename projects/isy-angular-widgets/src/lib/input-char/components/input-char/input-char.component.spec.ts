import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {InputCharDialogDirective} from '../../directives/input-char-dialog.directive';
import {Datentyp} from '../../model/datentyp';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {CharacterService} from '../../services/character.service';
import {DialogModule} from 'primeng/dialog';
import {InputCharAllCharsButtonComponent} from '../input-char-all-chars-button/input-char-all-chars-button.component';
import {
  InputCharPreviewCharListComponent
} from '../input-char-preview-char-list/input-char-preview-char-list.component';
import {InputCharSelectButtonComponent} from '../input-char-select-button/input-char-select-button.component';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {By} from '@angular/platform-browser';

const crypto = window.crypto
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
describe('InputCharComponent', () => {
  describe('InputCharComponent with default datentyp = DATENTYP_C', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;
    let charService: CharacterService;
    let sonderzeichenListe: Zeichenobjekt[];

    let randomIndex: number;

    const displayInputChar = () : void => {
      expect(component.displayCharPicker).toBeFalse();

      component.displayCharPicker = true;
      fixture.detectChanges();

      expect(component.displayCharPicker).toBeTrue();
    };

    const zeichenObjekt: Zeichenobjekt =   {
      zeichen: 'A',
      grundzeichen: 'A',
      schriftzeichengruppe: Schriftzeichengruppe.LATEIN,
      name: 'LATIN CAPITAL LETTER A',
      codepoint: 'U+0041'
    };
    beforeEach(async() => {
      await TestBed.configureTestingModule({
        declarations: [
          InputCharComponent,
          InputCharPreviewComponent,
          InputCharAllCharsButtonComponent,
          InputCharPreviewCharListComponent,
          InputCharSelectButtonComponent,
          InputCharDialogComponent,
          InputCharDialogDirective
        ],
        imports: [
          AccordionModule,
          ScrollPanelModule,
          DialogModule,
          ButtonModule,
          SelectButtonModule,
          FormsModule,
          BrowserAnimationsModule
        ],
        providers: [
          CharacterService
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(InputCharComponent);
      charService = TestBed.inject(CharacterService);
      component = fixture.componentInstance;
      component.displayCharPicker = false;
      sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
      randomIndex =   (crypto.getRandomValues(new Uint32Array(1)))[0]%sonderzeichenListe.length;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should check the default input property values', () => {
      expect(component.header).toEqual('');
      expect(component.isDialogClosable).toBeTrue();
      expect(component.isDialogDraggable).toBeTrue();
      expect(component.isDialogResizable).toBeFalse();
      expect(component.isDialogClosingOnOutsideClick).toBeFalse();
      expect(component.isDialogClosingOnEscape).toBeTrue();
      expect(component.isDialogModalDisplayed).toBeFalse();
      expect(component.displayCharPicker).toBeFalse();

      component.activeState.forEach(state => {
        expect(state).toBeFalse();
      });
    });

    it('should check the viewchilds availability while input char is displayed', () => {
      displayInputChar();

      expect((component as any).allChars).not.toBeUndefined();
      expect((component as any).base).not.toBeUndefined();
      expect((component as any).group).not.toBeUndefined();
      expect((component as any).charPreview).not.toBeUndefined();
    });

    it('should check if the input char is displayed', () => {
      expect(component.displayCharPicker).toBeFalse();
    });

    it('should check the number of available bases', () => {
      expect(component).toBeTruthy();
      const numberOfBases = [...new Set(sonderzeichenListe.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen))].length;
      expect(component.grundZeichenListe.length).toEqual(numberOfBases);
    });

    it('should check the number of available groups', () => {
      expect(component).toBeTruthy();
      const numberOfGroups = charService.getGroupsByDataType(Datentyp.DATENTYP_C).length;
      expect(component.schriftZeichenGruppen.length).toEqual(numberOfGroups);
    });

    it('should check the accordion toggle mechanism', () => {
      const accordionTabsNum = component.activeState.length;
      for (let i = 0; i < accordionTabsNum; i++) {
        const currentState = component.activeState[i];
        component.toggle(i);
        expect(component.activeState[i]).toEqual(!currentState);
      }
      expect(component).toBeTruthy();
    });

    it('should check the display attribute for the input char availability', () => {
      displayInputChar();

      component.displayCharPicker = false;
      fixture.detectChanges();
      expect(component.displayCharPicker).toBeFalse();
    });

    it('should check the char preview event firing on dialog close', () => {
      displayInputChar();

      const previewResetEmitterSpy = spyOn((component as any).charPreview.charSelection, 'emit');
      component.onDialogClose();

      const firstPreviewChar = (component as any).charPreview.options[0];
      expect(previewResetEmitterSpy).toHaveBeenCalledWith(firstPreviewChar);
    });

    it('should check the incoming preview event on dialog close', () => {
      displayInputChar();

      const previewZeichenObjektSpy = spyOn(component, 'previewZeichenObjekt');
      component.onDialogClose();

      const firstPreviewChar = (component as any).charPreview.options[0];
      expect((component as any).charPreview.selectedValue).toEqual(firstPreviewChar);
      expect(previewZeichenObjektSpy).toHaveBeenCalledWith(firstPreviewChar);
    });

    it('should check the char preview reset on dialog close', () => {
      displayInputChar();

      const previewResetSpy = spyOn((component as any).charPreview, 'reset');
      component.onDialogClose();
      expect(previewResetSpy).toHaveBeenCalled();
    });

    it('should check the char on selection functionality on dialog close', () => {
      displayInputChar();

      const previewOnSelectionSpy = spyOn((component as any).charPreview, 'onSelection');
      component.onDialogClose();

      const firstPreviewChar = (component as any).charPreview.options[0];
      expect(previewOnSelectionSpy).toHaveBeenCalledWith(firstPreviewChar);
    });

    it('should check the firing of all selection firing on dialog close', () => {
      displayInputChar();

      const onAllSelectionSpy = spyOn((component as any).allChars.allSelected, 'emit');
      component.onDialogClose();

      expect(onAllSelectionSpy).toHaveBeenCalled();
    });

    it('should check the incoming all selection event on dialog close', () => {
      displayInputChar();

      const onAllSelectionSpy = spyOn(component, 'onAllSelection');
      component.onDialogClose();

      expect(onAllSelectionSpy).toHaveBeenCalled();
    });

    it('should check the reset of all selection button', () => {
      displayInputChar();

      component.resetAllSelection();
      expect((component as any).allChars.allCharsValue).toEqual('');
    });

    it('should check the reset of base selection button', () => {
      displayInputChar();

      component.resetBaseSelection();
      expect((component as any).base.selectedValue).toEqual('');
    });

    it('should check the setupCharPickerAvailability function to have been called', () => {
      const setupCharPickerAvailabilitySpy = spyOn(component, 'setupCharPickerAvailability') .and. callThrough();
      component.setupCharPickerAvailability(true);
      fixture.detectChanges();
      expect(setupCharPickerAvailabilitySpy).toHaveBeenCalledWith(true);
      component.displayCharPicker = false;
      fixture.detectChanges();
      expect(component.displayCharPicker).toBeFalse();
    });

    it('should check the previewZeichenObjekt function to have been called', () => {
      const previewZeichenObjektSpy = spyOn(component, 'previewZeichenObjekt') .and. callThrough();
      component.previewZeichenObjekt(zeichenObjekt);
      fixture.detectChanges();
      expect(previewZeichenObjektSpy).toHaveBeenCalled();
    });

    it('should check the getSelectedZeichenObjekt function to have been called', () => {
      const spy = spyOn(component.valueChange, 'emit');
      component.getSelectedZeichenObjekt(zeichenObjekt);
      expect(spy).toHaveBeenCalled();
    });

    it('should check the resetAllSelection function to have been called', () => {
      const allChars = jasmine.createSpyObj('allChars', ['reset']);
      (component as any).allChars = allChars;
      component.resetAllSelection();
      expect(allChars.reset).toHaveBeenCalled();
    });

    it('should check the resetBase function to have been called', () => {
      const base = jasmine.createSpyObj('base', ['reset']);
      (component as any).base = base;
      component.resetBaseSelection();
      expect(base.reset).toHaveBeenCalled();
    });

    it('should check the resetGroupSelection function to have been called', () => {
      const group = jasmine.createSpyObj('group', ['reset']);
      (component as any).group = group;
      component.resetGroupSelection();
      expect(group.reset).toHaveBeenCalled();
    });

    it('should check the onDialogClose function to have been called', () => {
      const charPreview = jasmine.createSpyObj('charPreview', ['reset']);
      (component as any).charPreview = charPreview;
      const allChars = jasmine.createSpyObj('allChars', ['onAllSelection']);
      (component as any).allChars = allChars;
      component.onDialogClose();
      expect(charPreview.reset).toHaveBeenCalledBefore(allChars.onAllSelection);
    });

    it('should check the reset of group selection button', () => {
      displayInputChar();

      component.resetGroupSelection();
      expect((component as any).group.selectedValue).toEqual('');
    });

    it('should check the reset of group selection button', () => {
      displayInputChar();

      component.resetGroupSelection();
      expect((component as any).group.selectedValue).toEqual('');
    });

    it('should check the on all selection functionality', () => {
      displayInputChar();

      component.onAllSelection();
      expect((component as any).base.selectedValue).toEqual('');
      expect((component as any).group.selectedValue).toEqual('');

      const allowedGroups = charService.getGroupsByDataType(component.datentyp);
      const zeichenListe = charService.getCharacters().filter(z => allowedGroups.includes(z.schriftzeichengruppe));

      expect(component.zeichenObjekteToDisplay).toEqual(zeichenListe);
    });

    it('should check the on base selection functionality', () => {
      displayInputChar();

      const base = 'A';
      component.onBaseSelection(base);
      expect((component as any).allChars.allCharsValue).toEqual('');
      expect((component as any).group.selectedValue).toEqual('');

      const filteredByBase = charService.filterZeichenobjekteByBase(sonderzeichenListe, base);
      expect(component.zeichenObjekteToDisplay).toEqual(filteredByBase);
      expect(component.selectedZeichenObjekt).toEqual(filteredByBase[0]);
    });

    it('should check the on group selection functionality', () => {
      displayInputChar();

      const group = 'LATEIN';
      component.onGroupSelection(group);
      expect((component as any).allChars.allCharsValue).toEqual('');
      expect((component as any).base.selectedValue).toEqual('');

      const filteredByBase = charService.filterZeichenobjekteByGroup(sonderzeichenListe, group);
      expect(component.zeichenObjekteToDisplay).toEqual(filteredByBase);
      expect(component.selectedZeichenObjekt).toEqual(filteredByBase[0]);
    });

    it('should check the input char availability without closing param', () => {
      const onDialogCloseSpy = spyOn(component, 'onDialogClose');

      displayInputChar();

      component.setupCharPickerAvailability();
      expect(onDialogCloseSpy).toHaveBeenCalled();
    });

    it('should check the input char availability without closing param while is not displayed', () => {
      const onDialogCloseSpy = spyOn(component, 'onDialogClose');

      component.setupCharPickerAvailability();
      expect(onDialogCloseSpy).not.toHaveBeenCalled();
      expect(component.displayCharPicker).toBeTrue();
    });

    it('should check the input char availability with closing param', () => {
      displayInputChar();

      const onDialogCloseSpy = spyOn(component, 'onDialogClose');
      component.setupCharPickerAvailability(true);
      expect(onDialogCloseSpy).toHaveBeenCalled();
      expect(component.displayCharPicker).toBeTrue();
    });

    it('should check the zeichenobjekt preview', () => {
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[0]);

      const zeichenObjekt = component.zeichenObjekteToDisplay[randomIndex];
      component.previewZeichenObjekt(zeichenObjekt);

      expect(component.selectedZeichenObjekt).toEqual(zeichenObjekt);
    });


    it('should check the current value emitting on change', () => {
      const onValueChangeSpy = spyOn(component.valueChange, 'emit');

      const zeichenObjekt = component.zeichenObjekteToDisplay[0];
      component.getSelectedZeichenObjekt(zeichenObjekt);

      expect(onValueChangeSpy).toHaveBeenCalledWith(zeichenObjekt.zeichen);
    });

    it('should select the selected zeichenobjekt on init', () => {
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[0]);
    });

    it('should select the select the first zeichenobjekt', () => {
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[0]);

      component.selectedZeichenObjekt = component.zeichenObjekteToDisplay[1];
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[1]);

      component.selectFirstEntry();
      expect(component.selectedZeichenObjekt).not.toEqual(component.zeichenObjekteToDisplay[1]);
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[0]);
    });

    it('should check the input char button click functionality', () => {
      const onInputCharButtonClickSpy = spyOn(component, 'setupCharPickerAvailability');
      displayInputChar();

      const button = fixture.debugElement.query(By.css('#inputCharButton')).nativeElement as HTMLButtonElement;
      expect(button).not.toBeUndefined();
      expect(button.className).toContain('p-button');

      button.click();
      fixture.detectChanges();

      expect(component.displayCharPicker).toBeTrue();
      expect(onInputCharButtonClickSpy).toHaveBeenCalledWith();
    });
  });

  describe('InputCharComponent with datentyp = Datentyp_A', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;
    let characterService: CharacterService;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
        declarations: [
          InputCharComponent,
          InputCharPreviewComponent,
          InputCharAllCharsButtonComponent,
          InputCharPreviewCharListComponent,
          InputCharSelectButtonComponent,
          InputCharDialogComponent,
          InputCharDialogDirective
        ],
        imports: [
          AccordionModule,
          ScrollPanelModule,
          DialogModule,
          ButtonModule,
          SelectButtonModule,
          FormsModule,
          BrowserAnimationsModule
        ],
        providers: [
          CharacterService
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(InputCharComponent);
      characterService = TestBed.inject(CharacterService);
      component = fixture.componentInstance;
      component.datentyp = Datentyp.DATENTYP_A;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should check the number of available groups', () => {
      expect(component).toBeTruthy();
      const numberOfGroups = characterService.getGroupsByDataType(component.datentyp).length;
      expect(component.schriftZeichenGruppen.length).toEqual(numberOfGroups);
    });
  });
});
