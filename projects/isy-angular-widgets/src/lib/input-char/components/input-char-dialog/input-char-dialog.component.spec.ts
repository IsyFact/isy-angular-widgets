import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {InputCharModule} from '../../input-char.module';
import {MockComponent, MockModule} from 'ng-mocks';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {ComponentFixture} from '@angular/core/testing';
import {MultiSelectButtonComponent} from '../multi-select-button/multi-select-button.component';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

let spectator: Spectator<InputCharDialogComponent>;
let mockWidgetsConfigService: SpyObject<WidgetsConfigService>;
let fixture: ComponentFixture<InputCharDialogComponent>;
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [MockModule(AccordionModule), MockModule(SelectButtonModule), MockModule(FormsModule)],
    declarations: [MockComponent(InputCharPreviewComponent), MockComponent(MultiSelectButtonComponent)],
    mocks: [WidgetsConfigService]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    mockWidgetsConfigService = spectator.inject(WidgetsConfigService);
    mockWidgetsConfigService.getTranslation.and.callFake((key: string) => key);
    fixture = spectator.fixture;
    spectator.setInput('charList', sonderzeichenListe);
    spectator.detectChanges();
    component.ngOnChanges();
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onAllSelection for unexpected selection values', () => {
    const onAllSelectionSpy = spyOn(component, 'onAllSelection').and.callThrough();
    component.onSelection({group: 'unexpectedGroup', value: 'unexpectedValue'});
    expect(onAllSelectionSpy).toHaveBeenCalled();
  });

  it('should call resetDisplayedCharacters when onAllSelection is called', () => {
    const resetDisplayedCharactersSpy = spyOn(component, 'resetDisplayedCharacters').and.callThrough();
    component.onAllSelection();
    expect(resetDisplayedCharactersSpy).toHaveBeenCalled();
  });

  it('should create a MutationObserver and call initSelectButtonsData on attribute changes', (done) => {
    spyOn(component, 'initSelectButtonsData');
    component.ngAfterViewInit();
    const targetElement = spectator.element;
    targetElement.setAttribute('ng-reflect-all-button-options-label', 'test');
    setTimeout(() => {
      expect(component.initSelectButtonsData).toHaveBeenCalled();
      done();
    }, 100);
  });

  sonderzeichenListe.forEach((zeichen: Zeichenobjekt) => {
    it(`should emit the chosen character ${zeichen.zeichen} after button press`, () => {
      const button = spectator.query('#lower-right-panel button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      const insertCharacterSpy = spyOn(component.insertCharacter, 'emit');

      // Should use a model change event
      component.selectedZeichenObjekt = zeichen;

      button.click();
      component.insertSelectedZeichen();

      expect(insertCharacterSpy).toHaveBeenCalledWith(zeichen.zeichen);
    });
  });

  it('should have a button with the label "Einfügen"', () => {
    const button = spectator.query('#lower-right-panel button') as HTMLButtonElement;
    const insertLabel = mockWidgetsConfigService.getTranslation('inputChar.insert') ?? '';
    expect(button.innerHTML).toContain(insertLabel);
  });

  bases.forEach((grundzeichen: string) => {
    it(`should show only characters with a selected base ${grundzeichen}`, () => {
      const headerBaseChars = mockWidgetsConfigService.getTranslation('inputChar.headerBaseChars') ?? '';
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      component.onSelection({group: headerBaseChars, value: grundzeichen});
      spectator.detectChanges();

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();

      for (const char of options) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(grundzeichen);
      }
    });

    it(`should show all characters with a selected base ${grundzeichen}`, () => {
      const headerBaseChars = mockWidgetsConfigService.getTranslation('inputChar.headerBaseChars') ?? '';
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      component.onSelection({group: headerBaseChars, value: grundzeichen});
      spectator.detectChanges();

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === grundzeichen)
          .length
      );
    });
  });

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it('should show only characters with a selected schriftzeichengruppe', () => {
      const headerGroups = mockWidgetsConfigService.getTranslation('inputChar.headerGroups') ?? '';
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      component.onSelection({group: headerGroups, value: schriftzeichengruppe});
      spectator.detectChanges();

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();

      for (const character of options) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    });

    it('should show all characters with a selected schriftzeichengruppe', () => {
      const headerGroups = mockWidgetsConfigService.getTranslation('inputChar.headerGroups') ?? '';
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      component.onSelection({group: headerGroups, value: schriftzeichengruppe});
      spectator.detectChanges();

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [AccordionModule, SelectButtonModule, FormsModule, InputCharModule],
    declarations: [InputCharPreviewComponent, MultiSelectButtonComponent],
    providers: [WidgetsConfigService]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
    spectator.setInput('charList', sonderzeichenListe);
    spectator.detectChanges();
  });

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    const schriftzeichengruppeSelectButton = fixture.debugElement
      .queryAll(By.css('.charset1-select-button .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === schriftzeichengruppe)?.nativeElement as HTMLElement;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    schriftzeichengruppeSelectButton.click();
    fixture.detectChanges();
  };

  const selectBasis = (basis: string): void => {
    const basisSelectButton = fixture.debugElement
      .queryAll(By.css('.charset0-select-button .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === basis)?.nativeElement as HTMLElement;
    expect(basisSelectButton).toBeTruthy();

    basisSelectButton.click();
    fixture.detectChanges();
  };

  it(`should show ${bases.length} available bases`, () => {
    const baseButtons = spectator.queryAll('.charset0-select-button .p-buttonset div');
    expect(baseButtons.length).toEqual(bases.length);
  });

  it(`should show ${groups.length} available groups`, () => {
    const groupButtons = spectator.queryAll('.charset1-select-button .p-buttonset div');
    expect(groupButtons.length).toEqual(groups.length);
  });

  bases.forEach((base: string) => {
    it(`should show only characters with a selected base ${base}`, () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectBasis(base);

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();

      for (const char of options) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(base);
      }
    });

    it(`should show all characters with a selected base ${base}`, () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectBasis(base);

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === base).length
      );
    });
  });

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it('should show only characters with a selected schriftzeichengruppe', () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectSchriftzeichengruppe(schriftzeichengruppe);

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();

      for (const character of options) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    });

    it('should show all characters with a selected schriftzeichengruppe', () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectSchriftzeichengruppe(schriftzeichengruppe);

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });
});
