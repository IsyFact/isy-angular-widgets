import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {Datentyp} from '../../model/datentyp';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {CharacterService} from '../../services/character.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {By} from '@angular/platform-browser';
import {InputCharModule} from '../../input-char.module';

const crypto = window.crypto;

describe('InputCharComponent', () => {
  describe('InputCharComponent with default datentyp = DATENTYP_C', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;
    let charService: CharacterService;
    let sonderzeichenListe: Zeichenobjekt[];

    let randomIndex: number;

    const displayInputChar = () : void => {
      expect(component.visible).toBeFalse();

      component.visible = true;
      fixture.detectChanges();

      expect(component.visible).toBeTrue();
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
          InputCharComponent
        ],
        imports: [
          BrowserAnimationsModule,
          InputCharModule
        ],
        providers: [
          CharacterService
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(InputCharComponent);
      charService = TestBed.inject(CharacterService);
      component = fixture.componentInstance;
      component.visible = false;
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
      expect(component.isInputDisabled).toBeFalse();
      expect(component.visible).toBeFalse();

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
      expect(component.visible).toBeFalse();
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
        component.toggleTab(i);
        expect(component.activeState[i]).toEqual(!currentState);
      }
      expect(component).toBeTruthy();
    });

    it('should check the display attribute for the input char availability', () => {
      displayInputChar();

      component.visible = false;
      expect(component.visible).toBeFalse();
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

    it('should check the input char button availability', () => {
      const button = fixture.debugElement.query(By.css('#inputCharButton')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();

      component.isInputDisabled = false;
      fixture.detectChanges();
      expect(button.disabled).toBeFalsy();
    });

    it('should have the input char button to be disabled when isInputDisabled property is true', () => {
      const button = fixture.debugElement.query(By.css('#inputCharButton')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();
    });

    it('should have the input char button to be not disabled when isInputDisabled property is false', () => {
      const button = fixture.debugElement.query(By.css('#inputCharButton')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = false;
      fixture.detectChanges();
      expect(button.disabled).toBeFalsy();
    });

    it('should check the previewZeichenObjekt function to have been called', () => {
      const previewZeichenObjektSpy = spyOn(component, 'previewZeichenObjekt') .and. callThrough();
      component.previewZeichenObjekt(zeichenObjekt);
      fixture.detectChanges();
      expect(previewZeichenObjektSpy).toHaveBeenCalled();
    });

    it('should check the getSelectedZeichenObjekt function to have been called', () => {
      const spy = spyOn(component.insertCharacter, 'emit');
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

    it('should check the zeichenobjekt preview', () => {
      expect(component.selectedZeichenObjekt).toEqual(component.zeichenObjekteToDisplay[0]);

      const zeichenObjekt = component.zeichenObjekteToDisplay[randomIndex];
      component.previewZeichenObjekt(zeichenObjekt);

      expect(component.selectedZeichenObjekt).toEqual(zeichenObjekt);
    });

    it('should check the current value emitting on change', () => {
      const onValueChangeSpy = spyOn(component.insertCharacter, 'emit');

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

    it('should display after clicking the button', () => {
      const button = fixture.debugElement.query(By.css('#inputCharButton')).nativeElement as HTMLButtonElement;
      expect(button).not.toBeUndefined();
      expect(button.className).toContain('p-button');

      button.click();
      fixture.detectChanges();

      expect(component.visible).toBeTrue();
    });
  });

  describe('InputCharComponent with datentyp = Datentyp_A', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;
    let characterService: CharacterService;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
        declarations: [
          InputCharComponent
        ],
        imports: [
          BrowserAnimationsModule,
          InputCharModule
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
