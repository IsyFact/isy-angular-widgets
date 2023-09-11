import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {InputCharModule} from '../../input-char.module';

describe('InputCharComponent', () => {
  describe('InputCharComponent with default datentyp = DATENTYP_C', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;
    let charService: CharacterService;

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
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have the specified default input configuration', () => {
      expect(component.header).toEqual('');
      expect(component.isDialogClosable).toBeTrue();
      expect(component.isDialogDraggable).toBeTrue();
      expect(component.isDialogResizable).toBeFalse();
      expect(component.isDialogClosingOnOutsideClick).toBeFalse();
      expect(component.isDialogClosingOnEscape).toBeTrue();
      expect(component.isDialogModalDisplayed).toBeFalse();
      expect(component.isInputDisabled).toBeFalse();
      expect(component.visible).toBeFalse();
    });

    it('should not be visible by default', () => {
      expect(component.visible).toBeFalse();
    });

    it('should switch visibility according to attribute', () => {
      component.visible = true;
      expect(component.visible).toBeTrue();


      component.visible = false;
      expect(component.visible).toBeFalse();
    });

    it('should check the input char button availability', () => {
      const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();

      component.isInputDisabled = false;
      fixture.detectChanges();
      expect(button.disabled).toBeFalsy();
    });

    it('should have the input char button disabled when isInputDisabled property is true', () => {
      const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();
    });

    it('should have the input char button not disabled when isInputDisabled property is false', () => {
      const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
      component.isInputDisabled = false;
      fixture.detectChanges();
      expect(button.disabled).toBeFalsy();
    });

    it('should display after clicking the button', () => {
      const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
      expect(button).not.toBeUndefined();
      expect(button.className).toContain('p-button');

      button.click();
      fixture.detectChanges();

      expect(component.visible).toBeTrue();
    });

    it('should show 5 available groups', () => {
      expect(component).toBeTruthy();
      const numberOfGroups = charService.getGroupsByDataType(Datentyp.DATENTYP_C).length;
      const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichenGruppeSelectButton .p-buttonset div'));
      expect(groupButtons.length).toEqual(numberOfGroups);
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

    it('should show 3 available groups', () => {
      expect(component).toBeTruthy();
      const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichenGruppeSelectButton .p-buttonset div'));
      expect(groupButtons.length).toEqual(3);
    });

  });
});
